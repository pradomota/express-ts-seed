import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as mongoose from 'mongoose';
var speakeasy = require('speakeasy');

export type UserModel = mongoose.Document & {
  email: string,
  password: string,
  name: string,
  totp: {
    secret: string,
    active: boolean
  }

  checkPassword: (password: string, cb: (err: Error, isMatch: boolean) => {}) => void,
  checkTOTP: (code: number) => boolean,
  configureTOTP: () => string,
  disableTOTP: () => void
};

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  totp: {
    secret: String,
    active: { type: Boolean, default: false }
  }
}, { timestamps: true });

userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err: Error, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err: mongoose.Error, hash: string) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.checkPassword = function(password: string, cb: (err: Error, isMatch: boolean) => {}) {
  bcrypt.compare(password, this.password, (err: mongoose.Error , isMatch: boolean) => {
    cb(err, isMatch);
  });
};

userSchema.methods.checkTOTP = function (code: number): boolean {
  if (this.totp.secret) {
    return speakeasy.totp.verify({
      secret: this.totp.secret,
      encoding: 'base32',
      token: code,
      window: process.env.TOTP_WINDOW || 3
    });
  }
  return false;
};

userSchema.methods.configureTOTP = function (period: number): string {
  let secret = speakeasy.generateSecret({
    name: `${process.env.TOTP_ISSUER}:${this.email}`
  });
  this.totp.secret = secret.base32;
  return secret.otpauth_url;
};

userSchema.methods.disableTOTP = function (): boolean {
  this.totp.secret = '';
  this.totp.active = false;
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
