import { Router, Request, Response, NextFunction } from 'express';
import * as passportConfig from '../config/passport.config';

let info = require('../controllers/info.controller');
let user = require('../controllers/user.controller');

let router: Router = Router();

// Info
router.get('/', passportConfig.isAuthenticated, info.getHome);

// User
router.get('/login', passportConfig.isNotLogged, user.getLogin);
router.post('/login', passportConfig.isNotLogged, user.postLogin);
router.get('/sign-up', passportConfig.isNotLogged, user.getSignup);
router.post('/sign-up', passportConfig.isNotLogged, user.postSignup);

module.exports = router;
