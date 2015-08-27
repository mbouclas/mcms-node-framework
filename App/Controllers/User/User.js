module.exports = (function(App,Package) {
    var IP = require('request-ip');
    var path = require('path');
    var maxmind = require('maxmind');
    maxmind.init(path.join(App.Config.baseDir,App.Config.services.maxmind.path) + '/' + App.Config.services.maxmind.files.city);
    var User = App.Connections.mongodb.models.User;

    return {
        name: 'User',
        nameSpace: 'User',
        get: get,
        subscribeToNewsletter :subscribeToNewsletter,
        unSubscribeFromNewsletter : unSubscribeFromNewsletter,
        signUp : signUp,
        registerUser : registerUser,
        checkEmail : checkEmail,
        activateUser : activateUser,
        forgotPassword : forgotPassword,
        resetPasswordUI : resetPasswordUI,
        resetPassword : resetPassword
    };

    function get(req,res,next){
        return res.render('Checkout/checkout.html',{});
    }

    function signUp(req,res,next){
        return res.render('User/signUp.html',{});
    }

    function subscribeToNewsletter(req,res,next){

        var userIp = /*IP.getClientIp(req)*/ '91.184.213.43',
            location = maxmind.getLocation(userIp);
        var name = {
            firstName : '',
            lastName : ''
        };
        if (req.body.user.name){
            var splitName = req.body.user.name.split(' ');
            name.firstName = splitName[0];
            name.lastName = splitName[1];
        }
        if (req.user){
            name.firstName = req.user.firstName;
            name.firstName = req.user.lastName;
        }
        var email = (req.user) ? req.user.email : req.body.user.email;

        var subscriber = {
            email : email,
            firstName : name.firstName,
            lastName : name.lastName,
            ip : userIp,
            area : req.body.area || 'site',
            postData : {},
            location : {
                country : location.countryName,
                city : location.city,
                latitude : location.latitude,
                longitude : location.longitude
            }
        };

        if (req.user){
            subscriber.uid = App.Helpers.MongoDB.idToObjId(req.user.uid);
        }

        App.Services['mcmsNodeNewsletter'].Mailchimp.subscribe(App.Config.services.mailchimp.defaultListId,subscriber,function(err,result){
            if (err){
                var ret = {error : err};
                if (err.name){
                    ret.error = err.name;
                }
                return res.status(409).send(ret);
            }

            res.send({success:true});
        });

    }


    function unSubscribeFromNewsletter(req,res,next){
        var email = (req.user) ? req.user.email : req.body.user.email;
        if (!email){
            return res.status(409).send('notFound');
        }

        App.Services['mcmsNodeNewsletter'].Mailchimp.unsubscribe(email,function(err,data){
            if (err){
                var ret = {error : err};
                if (err.name){
                    ret.error = err.name;
                }
                return res.status(409).send(ret);
            }

            res.send({success:true});
        });
    }

    function checkEmail(req,res,next){
        if (!req.body.email) {
            return res.send({success : false});
        }

        User.findOne({email : req.body.email}).exec(function (err, user) {
            if (err || user){
                return res.send({success : false});
            }
            return res.send({success : true});
        });
    }


    function registerUser(req,res,next){
        if (!req.body.user){
            return res.status(409).send({error : 'noValidDataFound'});
        }

        //call the user service
        App.User.create(App.Helpers.MongoDB.sanitizeInput(req.body.user),function(err,user){
            if (err){
                return res.status(409).send({error : 'userNotCreated'});
            }

            return res.send({success: true});
        });

    }

    function activateUser(req,res,next){
        if (!req.params.token){
            req.flash('activationFail',false);
            return res.redirect(App.Route.url('UserCP'));
        }
        var userIp = /*IP.getClientIp(req)*/ '91.184.213.43',
            location = maxmind.getLocation(userIp);
        if (!App.Cache.AccountActivations){
            App.Cache.AccountActivations = {};
        }
        location.ip = userIp;
        App.Cache.AccountActivations[req.params.token] = location;

        App.User.activateUser(App.Helpers.MongoDB.sanitizeInput(req.params.token),function(err,result){
            if (err){
                req.flash('activationFail',false);
                return res.redirect(App.Route.url('UserCP'));
            }

            req.flash('activationSuccess',true);

            res.redirect(App.Route.url('UserCP'));
        });
    }

    function forgotPassword(req,res,next){
        if (!req.body.email){
            return res.status(409).send({error : 'invalidData'});
        }

        App.User.forgotPassword(App.Helpers.MongoDB.sanitizeInput(req.body.email),function(err,result){
            if (err){
                return res.status(409).send({error : 'invalidData'});
            }

            return res.send({success: true});
        });
    }

    function resetPasswordUI(req,res,next){
        if (!req.params.token){
            req.flash('invalidToken',false);
            return res.redirect(App.Route.url('UserCP'));
        }

        App.User.resetUserPassword(App.Helpers.MongoDB.sanitizeInput(req.params.token),function(err,result){
            if (err){
                req.flash('resetFail',false);
                return res.redirect(App.Route.url('UserCP'));
            }
            req.session.forgotPasswordToken = req.params.token;
            res.render('User/resetPassword.html');
        });
    }

    function resetPassword(req,res,next){
        if (!req.session.forgotPasswordToken){
            return res.send({success: false});
        }

        var newPassword = App.Crypt.make(App.Helpers.MongoDB.sanitizeInput(req.body.password));
        App.Connections.mongodb.models.User
            .update({'passwordReminder.token' : req.session.forgotPasswordToken},{password: newPassword,passwordReminder :{}},function(err,raw){
                if (err){
                    return res.send({success: false});
                }

                delete req.session.forgotPasswordToken;
                return res.send({success: true});
            });

    }
});