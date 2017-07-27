import { Router, Request, Response, NextFunction } from 'express';
import { Result } from 'express-validator';
import * as i18n from 'i18n';

exports.getSignup = (req: Request, res: Response) => {
  let options: any = {};
  options.title = i18n.__('signup');

  res.render('user/sign-up', options);
};
