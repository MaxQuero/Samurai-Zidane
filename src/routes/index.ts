import * as express from 'express'
import passport from "passport";
const router = express.Router();
const User = require ('../models/User');

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    if ( req.session && req.session.passport && req.session.passport.user != null ) {
        res.redirect('/');
    } else {
        res.render('auth', {
            title: 'bonsoir'
        });

    }

});

router.post('/register', function(req, res, next) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err: Error, user : any) {
        if (err) {
            return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, function () {
            if( req.session) {
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/');
                });
            }

        });
    });
});

router.get('/login', function(req, res) {
    if ( req.session && req.session.passport && req.session.passport.user != null ) {
        res.redirect('/');
    } else {
        res.render('login', {
            user : req.user,
            title : 'Sign-in',
            subTitle : 'Come back please !'
        });
    }
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    if ( req.session && req.session.passport && req.session.passport.user != null ) {
        res.redirect('/');
    } else {
        res.redirect('/register');
    }
});

router.get('/logout', function(req, res) {
    if ( req.session && req.session.passport && req.session.passport.user != null ) {
        req.logout();
        res.redirect('/');
    }
    else {
        res.redirect('/')
    }
});


export default router;