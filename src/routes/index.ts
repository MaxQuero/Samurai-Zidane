import * as express from 'express'
import passport from "passport";
const router = express.Router();
let User = require("../models/User");

router.get('/', function (req, res) {
    res.json('success');
});

router.get('/register', function(req, res) {
    if ( req.session && req.session.passport && req.session.passport.user != null ) {
        res.json('success');
    } else {
        res.json({
        });
    }

});

router.post('/register', function(req, res, next) {
    User.register(new User({
            username: req.body.username
        }),
        req.body.password, (err: any, user: any) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    err: err
                });
            } else {
                passport.authenticate('local')(req, res, () => {
                    User.findOne({
                        username: req.body.username
                    }, (err:any , person: any) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            user: req.session,
                            success: true,
                            status: 'Registration Successful!',
                        });
                    });
                })
            }
        })
});

router.get('/login', function(req, res) {
    if ( req.session && req.session.passport && req.session.passport.user != null ) {
        //res.redirect('/');
        res.json(req.session)
    } else {
        res.json(req.session);
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err: any, person: any) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            user: req.body.username,
            success: true,
        });
    })
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.clearCookie('session-id');
                res.json({
                    message: 'You are successfully logged out!'
                });
            }
        });
    } else {
        var err = new Error('You are not logged in!');
        next(err);
    }
});

export default router;