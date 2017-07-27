import { Router, Request, Response, NextFunction } from 'express';
import * as i18n from 'i18n';

exports.getHome = (req: Request, res: Response) => {
  let options: any = {};
  options.title = i18n.__('home');

  res.render('info/home', options);
};
