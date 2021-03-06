'use strict';

const User = require('../models/User');
const bcrypt = require('bcrypt');
const getUser = require('../lib/coteRequester');
const jwt = require('jsonwebtoken');

class LoginController {

  index(req, res, next) {
    res.locals.email = '';
    res.render('login');
    
  }

  async post (req, res, next){
    try {

      const email = req.body.email;
      const password = req.body.password;
 
      const user = await getUser(email, password); //await User.findOne({email});

      console.log('logincontroller user: ', user)
      /*
      const user = await User.findOne({email});
  
      if (!user || !await bcrypt.compare(password, user.password)) {
        res.locals.email = email;
        res.locals.error = res.__('ivalid user');
        res.render('login');
        return;
      }
*/
      req.session.authUser = user._id;

      res.redirect('/privado');
      
      //mando mail por probar el servicio

      await user.sendEmail(process.env.ADMIN_EMAIL, 'new login', 
        'We are glad to seeing you again on our API. Cheers!');
    } catch(err) {
      next(err);
    }
  }

  logout(req, res, next){
    req.session.regenerate(err => {
      if(err) {
        next(err);
        return;
      }
      res.redirect('/');
    });
  }

  async postJWT (req, res, next){
    try {
  
      const email = req.body.email;
      const password = req.body.password;
  
      console.log(email, password);
  
      const user = await User.findOne({email});
  
      if (!user || !await bcrypt.compare(password, user.password)) {
        const error = new Error('invalid credentials');
        error.status = 401;
        next(error);
        return;
      }
      const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '2d'});

      res.json({token})
  
    } catch(err) {
      next(err);
  }
  }
}

module.exports = new LoginController();
