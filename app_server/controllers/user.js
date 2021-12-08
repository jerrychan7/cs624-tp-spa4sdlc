const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('Users');

const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({"message": "All fields required"});
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save((err) => {
    if (err) {
      res.status(400);
      switch (err.code) {
      case 11000:
        return res.json({
          message: `duplicate key: [${Object.keys(err.keyPattern).join(",")}]`,
        });
      default:
        return res.json(err);
      }
    }
    const token = user.generateJwt();
    res.status(200).json({token});
  });
};
const del = async (req, res) => {};
const login = async (req, res, next) => {
  if (!req.body.name || !req.body.password) {
    return res.status(400)
      .json({"message": "All fields required"});
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (!user) return res.status(401).json(info);
    const token = user.generateJwt();
    res.status(200).json({token});
  })(req, res, next);
};
const update = async (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res.status(400)
      .json({"message": "All fields required"});
  }
  console.log("TODO: update user info");
};
const getUserByID = async (req, res) => {
  User.findById(req.params.usrID)
  .exec((err, user) => {
    if (!user) return res.status(404).json({"massage": "user not found"});
    if (err) return res.status(404).json(err);
    return res.status(200).json({token: user.generateJwt()});
  });
};
const getUserByNameOrEmail = async (req, res) => {
  const { name, email } = req.query;
  if (!name && !email) {
    return res.status(400).json({"message": "All fields required"});
  }
  const users = await User.find({$or: [{name}, {email}]}).exec();
  // console.log(users);
  res.status(200).json(users.map(usr => ({token: usr.generateJwt()})));
};

module.exports = {
  register,
  login,
  del,
  update,
  getUserByID,
  getUserByNameOrEmail,
};
