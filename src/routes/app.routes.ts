import { Router, Request, Response, NextFunction } from 'express';

let info = require('../controllers/info.controller');
let user = require('../controllers/user.controller');

let router: Router = Router();

// Info
router.get('/', info.getHome);

// User
router.get('/login', user.getLogin);
router.get('/sign-up', user.getSignup);
router.post('/sign-up', user.postSignup);

module.exports = router;
