// ----------------------------------------------
// IMPORT MODULES
// ----------------------------------------------
const pool = require("./pool");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// ----------------------------------------------
// USER MODEL
// ----------------------------------------------
function User() { };

User.prototype = {
    // we search users who has a given username
    // we enforce the rule that each username is unique
    // thus, this returns either an empty or 1-element array
    find: function (username, callback) {
        let sql = `SELECT * FROM users WHERE username = ?`;
        pool.query(sql, username, (err, result) => {
            if (err) throw err;
            if (result.length) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },
    // we check if such a username is already used
    // yes => callback(null)
    // no => create the user
    create: function (body, callback) {
        this.find(body.username, (found) => {
            if (found) {
                // the username is already chosen
                return callback(null);
            } else {
                bcrypt.hash(body.passcode, saltRounds, (err, hash) => {
                    var bind = [body.username, body.fullname, hash];
                    let sql = `INSERT INTO users(username, fullname, passcode) VALUES (?, ?, ?)`;
                    pool.query(sql, bind, function (err, lastID) {
                        if (err) throw err;
                        callback(lastID);
                    });
                });
            }
        });

    },
    // given an username and passcode, login the user
    login: function (username, passcode, callback) {
        this.find(username, (found) => {
            if (found) {
                // there is a user found
                bcrypt.compare(passcode, found.passcode, (err, res) => {
                    if (res) {
                        // the password is matched
                        callback(found);
                        return;
                    } else {
                        // the password is NOT matched
                        callback(null);
                    }
                });
            } else {
                // there is no user found
                callback(null);
            }
        });
    },
    // given an ID, find the corresponding username
    // since this is invoked once an user has already logged in
    // thus, we need not handle the case where result.length == 0
    findUserName: function (userID, callback) {
        var sql = "SELECT username FROM users WHERE id = ?";
        pool.query(sql, userID, (err, result) => {
            if (err) throw err;
            if (result.length) {
                callback(result[0]);
            }
        });
    }
}

module.exports = User;