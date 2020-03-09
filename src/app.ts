import Server from "./config/server";
import router from './routes/index'
import bodyParser from "body-parser";
import passport from "passport"
import session from "express-session";
import cors from 'cors';
let LocalStrategy = require('passport-local');

 class App {
    app: any;
    constructor() {
        this.app = new Server(4000);
        this.app = this.app.start();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(session({
            secret: 'zizou',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
        }));
        this.app.use(cors());
        this.passportSession();

        this.loadRoutes();
    }

    private loadRoutes() {
        this.app.use('/', router);
    }

    private passportSession() {
        let User = require('./models/User');
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
    }
}

export default new App();