// ----------------------------------------------
// FEEDBACK MODEL
// ----------------------------------------------
const pool = require("./pool");

function Feedback() { };

Feedback.prototype = {
    // An user can provide a feedback to the web admin
    // but he must log in beforehand
    create: function (body, callback) {
        var bind = [body.userID, body.feedback];
        var sql = "INSERT INTO feedbacks(userID, content) VALUES (?, ?)";
        pool.query(sql, bind, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
}

module.exports = Feedback;