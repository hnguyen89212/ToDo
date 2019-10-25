var Helper = {};

// Once an user has logged in, prevent them from access /login or /register
Helper.preventBackWardRouting = function (req, res) {
    if (req.session.userID)
        return true;
    else
        return false;
};

// If an user fails to provide valid credentials logging in
Helper.showInvalidCredentials = function (req, res) {
    if (req.flash()) {
        var flashMsg = req.flash().invalidCredentials;
        res.render("login", { flashMsg: flashMsg, status: false });
        return;
    }
};

// If an user accidentally chooses an occupied username
Helper.showFailedReg = function (req, res) {
    if (req.flash()) {
        var flashMsg = req.flash().unavailableCredentials;
        res.render("register", { flashMsg: flashMsg, status: false });
        return;
    }
};

Helper.proccessDate = function (deadline) {
    var monthStr = "";
    var month = deadline.getMonth() + 1;
    // Why we need to see if the month is 1-digit or 2-digit?
    // because, HTML only accepts 06 as June, NOT 6!
    monthStr += (month < 10) ? ("0" + month) : month;
    var ret = "" + deadline.getFullYear() + "-" + monthStr + "-" + deadline.getDate() + "T" + deadline.getHours() + ":" + deadline.getMinutes();
    return ret;
}

module.exports = Helper;