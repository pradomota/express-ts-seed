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

router.get('/two-factor', passportConfig.isTwoFactorNeeded, user.getTwoFactor);
router.post('/two-factor', passportConfig.isTwoFactorNeeded, user.postTwoFactor);

router.get('/logout', passportConfig.isAuthenticated, user.getLogout);

router.get('/sign-up', passportConfig.isNotLogged, user.getSignup);
router.post('/sign-up', passportConfig.isNotLogged, user.postSignup);

router.get('/profile', passportConfig.isAuthenticated, user.getProfile);
router.post('/profile/configure-two-factor', passportConfig.isAuthenticated, user.postConfigureTwoFactor);
router.post('/profile/activate-two-factor', passportConfig.isAuthenticated, user.postActivateTwoFactor);
router.post('/profile/disable-two-factor', passportConfig.isAuthenticated, user.postDisableTwoFactor);


module.exports = router;
