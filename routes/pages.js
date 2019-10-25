// ----------------------------------------------
// IMPORT MODULES
// ----------------------------------------------
const express = require("express");
const router = express.Router();

// ----------------------------------------------
// IMPORT MODELS
// ----------------------------------------------
const User = require("../core/user");
const Task = require("../core/task");
const Feedback = require("../core/feedback");
const Helper = require("./helper/helper");

var user = new User();
var task = new Task();
var feedback = new Feedback();

// ----------------------------------------------
// BEFORE AN USER HAS LOGGED IN,
// HERE ARE THE ROUTES THEY CAN ACCESS
// ----------------------------------------------
router.get("/", (req, res, next) => {
    if (Helper.preventBackWardRouting(req, res)) {
        return res.redirect("/index-authenticated");
    }
    res.render("index");
});

router.get("/login", (req, res) => {
    if (Helper.preventBackWardRouting(req, res)) {
        return res.redirect("/addtask");
    }
    Helper.showInvalidCredentials(req, res);
    res.render("login", { flashMsg: null, status: null });
});

router.post("/login", (req, res, next) => {
    user.login(req.body.username, req.body.passcode, (result) => {
        if (result) {
            req.session.userID = result.id;
            req.session.username = result.username;
            res.redirect("/addtask");
        } else {
            req.flash("invalidCredentials", "Username or Password is incorrect");
            res.redirect("/login");
        }
    });
})

router.get("/register", (req, res, next) => {
    if (Helper.preventBackWardRouting(req, res)) {
        return res.redirect("/addtask");
    }
    Helper.showFailedReg(req, res);
    res.render("register", { flashMsg: null, status: null });
});

router.post("/register", (req, res, next) => {
    let input = {
        username: req.body.username,
        fullname: req.body.fullname,
        passcode: req.body.passcode
    };
    user.create(input, (lastID) => {
        if (lastID) {
            var flashMsg = "Successful registration";
            res.render("login", { flashMsg: flashMsg, status: true });
        } else {
            req.flash("unavailableCredentials", "Username is already used");
            res.redirect("/register");
        }
    });
});

// ----------------------------------------------
// AFTER AN USER HAS LOGGED IN,
// HERE ARE THE ROUTES THEY CAN ACCESS
// ----------------------------------------------
router.get("/index-authenticated", (req, res, next) => {
    res.render("index-authenticated");
})

router.get("/addtask", (req, res, next) => {
    if (req.session.userID && req.session.username) {
        res.render("addtask");
    } else {
        res.render("login", { flashMsg: null, status: null });
    }

});

router.post("/addtask", (req, res, next) => {
    if (req.session.userID && req.session.username) {
        var body = req.body;
        body.userID = req.session.userID;
        task.create(body, () => {
            res.redirect("/seetask");
        });
    } else {
        res.redirect("/");
    }
});

router.get("/seetask", (req, res, next) => {
    if (req.session.userID && req.session.username) {
        task.findAll(req.session.userID, (result) => {
            res.render("seetask", { result: result });
        });
    } else {
        res.redirect("/login");
    }
});

router.get("/searchtask", (req, res, next) => {
    if (req.session.userID && req.session.username) {
        res.render("searchtask");
    } else {
        res.redirect("/login");
    }
});

router.post("/searchtask", (req, res, next) => {
    if (req.session.userID && req.session.username) {
        var body = req.body;
        body.userID = req.session.userID;
        task.search(body, (result) => {
            res.render("seesometask", { result: result });
        });
    } else {
        res.redirect("/");
    }
});

router.get("/feedback", (req, res, next) => {
    if (req.session.userID && req.session.username) {
        user.findUserName(req.session.userID, (result) => {
            res.render("feedback", { username: result.username });
        });
    } else {
        res.redirect("/login");
    }
});

router.post("/feedback", (req, res, next) => {
    if (req.session.userID && req.session.username) {
        var content = req.body.feedback.replace(/(\r\n|\n|\r)/gm, " -- ");
        var body = {
            feedback: content,
            userID: req.session.userID
        };
        feedback.create(body, (result) => { });
        res.redirect("/addtask");
    } else {
        res.redirect("/");
    }
});

// ----------------------------------------------
// UPDATE A TASK
// ----------------------------------------------
router.get("/task/:id/edit", (req, res, next) => {
    // collect the all data, send to the update page
    // so that user can easily see the old values for all fields
    task.find(req.params.id, (foundTask) => {
        // Why we need "Helper.proccessDate"?
        // As we want to preset the datetime input field in the form in "updatetask"
        // A way is to set the "value" property of the input field with a string
        var dateString = Helper.proccessDate(foundTask.deadline);
        res.render("updatetask", { taskID: req.params.id, oldTask: foundTask, deadlineString: dateString });
    });
});

router.put("/task/:id", (req, res, next) => {
    var body = {
        taskID: req.params.id,
        task: req.body.task,
        deadline: req.body.deadline,
        comment: req.body.comment
    };
    task.update(body, () => {
        res.redirect("/seetask");

    });
});

// ----------------------------------------------
// DELETE A TASK
// ----------------------------------------------
router.delete("/task/:id", (req, res, next) => {
    task.remove(req.params.id, () => {
        res.redirect("/seetask");
    });
});

// ----------------------------------------------
// LOG OUT
// ----------------------------------------------
router.get("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
})

module.exports = router;