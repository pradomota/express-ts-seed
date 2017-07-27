import { Router, Request, Response, NextFunction } from 'express';
import { Result } from 'express-validator';
import { default as User, UserModel } from '../models/user.model';
import * as i18n from 'i18n';

exports.getSignup = (req: Request, res: Response) => {
  let options: any = {};
  options.title = i18n.__('signup');

  res.render('user/sign-up', options);
};

exports.postSignup = (req: Request, res: Response, next: NextFunction) => {
  var options: any = {};
  options.title = i18n.__('signup');

  req.assert('name', i18n.__('validation.name.empty')).notEmpty();
  req.assert('email', i18n.__('validation.email.email')).isEmail();
  req.assert('password', i18n.__('validation.password.len')).len(<ExpressValidator.Options.MinMaxOptions>{min: 8});
  req.assert('confirmPassword', i18n.__('validation.password.match')).equals(req.body.password);

  req.sanitize('name').escape();
  req.sanitize('email').trim();

  req.getValidationResult().then((result: Result) => {

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    options.user = user;

    if (result.isEmpty()) {
      User.findOne({ email: req.body.email}, (err: Error, existingUser: boolean) => {
        if (err) {
          return next(err);
        } else if (existingUser) {
          options.errors = { email: { param: 'email', msg: i18n.__('validation.email.exists') }};
          res.render('user/sign-up', options);
        } else {
          user.save((err: Error) => {
            if (err) { return next(err); }
            res.redirect('/');
          });
        }
      });
    } else {
      options.errors = result.mapped();
      res.render('user/sign-up', options);
    }
  });
};