import { Router, Request, Response, NextFunction } from 'express';

let info = require('../controllers/info.controller');
let user = require('../controllers/user.controller');

let router: Router = Router();

// Info
router.get('/', info.getHome);

// User
router.get('/sign-up', user.getSignup);

module.exports = router;
