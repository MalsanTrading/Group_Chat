'use strict';

const passport = require('passport');
const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;

//inside user be store userid,name.. /done then save it in z session 
passport.serializeUser((user,done)=>{
    done(null,user.id);
});
//take z id of user and compare it save of z session if it much return user data 
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{ //retien as an object inside this user 
        done(err,user);//if err add value to z err call back //if there is no error = to null
    });
});

passport.use('local.signup',new localStrategy({
    usernameField: 'email', //default user signup
    passwordField: 'password',//
    passReqToCallback: true, //all user data pass in to call back  //if it false noting data will return
},(req,email,password,done)=>{//

    User.findOne({'email': email},(err,user)=>{ //to check if z email is exist then display message to users
        if(err){ //network err 
            return done(err);
        }
        if(user){ //
            return done(null,false,req.flash('error','user with email already exist')); //using flush
        }
        const newUser = new User();//
        newUser.username = req.body.username; //match form name
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password); //saved as encrypted password insed z db

        newUser.save((err)=>{ //save data
            done(null,newUser);
        });
    });

}));