import { Router, Request, Response, NextFunction } from 'express';

let info = require('../controllers/info.controller');

let router: Router = Router();

// Info
router.get('/', info.getHome);

module.exports = router;
