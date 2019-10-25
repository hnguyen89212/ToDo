// ----------------------------------------------
// TASK MODEL
// ----------------------------------------------
const pool = require("./pool");

function Task() { };

Task.prototype = {
    // A task can be created provided that taskname(task), deadline and comment are specified.
    create: function (body, callback) {
        var bind = [body.userID, body.task, body.deadline, body.comment];
        var sql = "INSERT INTO tasks(userID, task, deadline, comment) VALUES (?, ?, ?, ?)";
        pool.query(sql, bind, (err, lastID) => {
            if (err) throw err;
            callback(lastID);
        });
    },
    // Finds all tasks that are coming first, store them in FIRST half of array
    // Finds add tasks that haved passed then, store them in SECOND half of array
    findAll: function (userID, callback) {
        var finalResult = [];
        var sql = "SELECT * FROM tasks WHERE userID = ? AND deadline > NOW()";
        pool.query(sql, userID, (err, result) => {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                finalResult.push(result[i]);
            }
        });
        sql = "SELECT * FROM tasks WHERE userID = ? AND deadline <= NOW() ORDER BY deadline DESC";
        pool.query(sql, userID, (err, result) => {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                finalResult.push(result[i]);
            }
            callback(finalResult);
        });

    },
    // Searches for a task corresponding to a particular user.
    search: function (body, callback) {
        var bind = [body.userID, "%" + body.task + "%", "%" + body.task + "%"];
        var sql = "SELECT * FROM tasks WHERE userID = ? AND task LIKE ? OR comment LIKE ?";
        pool.query(sql, bind, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    remove: function (taskID, callback) {
        var sql = "DELETE FROM tasks WHERE id = ?";
        pool.query(sql, taskID, (err, result) => {
            if (err) throw err;
            callback();
        });
    },
    update: function (body, callback) {
        var bind = [body.task, body.deadline, body.comment, body.taskID];
        var sql = "UPDATE tasks SET task = ?, added_at = NOW(), deadline = ?, comment = ? WHERE id = ?";
        pool.query(sql, bind, (err, result) => {
            if (err) throw err;
            callback();
        })
    },
    // Searches for a task having a specific ID
    find: function (taskID, callback) {
        var sql = "SELECT * FROM tasks WHERE id = ?";
        pool.query(sql, taskID, (err, result) => {
            if (err) throw err;
            callback(result[0]);
        });
    }
}

module.exports = Task;