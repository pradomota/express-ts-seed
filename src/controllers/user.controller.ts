import { Router, Request, Response, NextFunction } from 'express';
import { Result } from 'express-validator';
import { default as User, UserModel } from '../models/user.model';
import * as i18n from 'i18n';
import * as passport from 'passport';

exports.getLogin = (req: Request, res: Response) => {
  let options: any = {};
  options.title = i18n.__('login');

  res.render('user/login', options);
};

exports.postLogin = (req: Request, res: Response, next: NextFunction) => {
  let options: any = {};
  options.title = i18n.__('login');

  req.assert('email', i18n.__('validation.email.email')).isEmail();
  req.assert('password', i18n.__('validation.password.empty')).notEmpty();

  req.sanitize('email').trim();

  req.getValidationResult().then((result: Result) => {
    const user = new User({
      email: req.body.email
    });
    options.user = user;

    if (result.isEmpty()) {
      passport.authenticate('local-login', (err: Error, user: UserModel, info: any) => {
        if (err) { return next(err); }
        if (!user) {
          options.errors = { auth: { param: 'auth', msg: info.message}};
          res.render('user/login', options);
        } else {
          req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.redirect(req.session.returnTo || '/');
          });
        }
      })(req, res, next);

    } else {
      options.errors = result.mapped();
      res.render('user/login', options);
    }
  });

};

exports.getTwoFactor = (req: Request, res: Response) => {
  let options: any = {};
  options.title = i18n.__('two_factor');

  res.render('user/two-factor', options);
};

exports.postTwoFactor = (req: Request, res: Response, next: NextFunction) => {
  let options: any = {};
  options.title = i18n.__('two_factor');

  req.assert('code', i18n.__('validation.password.empty')).notEmpty();

  req.getValidationResult().then((result: Result) => {
    if (result.isEmpty()) {
      passport.authenticate('local-totp', (err: Error, user: UserModel, info: any) => {
        if (err) { return next(err); }
        if (!user) {
          options.errors = { code: { param: 'code', msg: info.message } };
          res.render('user/two-factor', options);
        } else {
          req.session.twoFactor = true;
          res.redirect(req.session.returnTo || '/');
        }
      })(req, res, next);
    } else {
      options.errors = result.mapped();
      res.render('user/two-factor', options);
    }
  });

};

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
            req.logIn(user, (err: Error) => {
              if (err) { return next(err); }
              res.redirect('/');
              });
          });
        }
      });
    } else {
      options.errors = result.mapped();
      res.render('user/sign-up', options);
    }
  });
};

exports.getLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout();
  req.session.destroy(function (err: Error) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

exports.getProfile = (req: Request, res: Response) => {
  let options: any = {};
  options.title = i18n.__('profile');
  options.user = req.user;

  res.render('user/profile', options);
};

