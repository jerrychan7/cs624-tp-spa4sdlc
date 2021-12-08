const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = require('./utils.js');

const userSchema = new Schema({
  email: {
    type: Types.String,
    unique: true,
    required: true,
  },
  name: {
    type: Types.String,
    unique: true,
    required: true,
  },
  hash: Types.String,
  salt: Types.String,
  projectId: [Types.ObjectId],
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    projectId: this.projectId,
    exp: parseInt(expiry.getTime() / 1000, 10),
  }, process.env.JWT_SECRET);
};

mongoose.model('Users', userSchema);
