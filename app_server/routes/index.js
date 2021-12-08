const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
let auth;
auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
  algorithms: ['HS256'],
});
const ctrlUsr = require('../controllers/user.js');
const ctrlPrj = require('../controllers/projects.js');

router.route('/usr')
  // body name&password&email
  .post(ctrlUsr.register)
  // body name&password
  .put(ctrlUsr.login)
  // ?[name]&[email]
  .get(ctrlUsr.getUserByNameOrEmail);

router.route('/usr/:usrID')
  .delete(ctrlUsr.del)
  // body name&password&[new_name]&[new_password]&[new_email]
  .put(ctrlUsr.update)
  .get(ctrlUsr.getUserByID);



router.route('/prjs')
  // ?usrID
  .get(auth, ctrlPrj.getPrjsByUsr);

router.route('/prj')
  .post(auth, ctrlPrj.addPrj);
router.route('/prj/:prjID')
  .delete(auth, ctrlPrj.delPrj)
  .put(auth, ctrlPrj.updatePrj)
  .get(auth, ctrlPrj.getPrj);


router.route('/prj/:prjID/board')
  .post(auth, ctrlPrj.addBoard);
router.route('/prj/:prjID/board/:boardID')
  .delete(auth, ctrlPrj.delBoard)
  .put(auth, ctrlPrj.updateBoard)
  .get(auth, ctrlPrj.getBoard);


module.exports = router;
