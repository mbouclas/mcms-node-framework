module.exports = (function(App){
    App.Event.on('user.created',function(User){
        App.pmx.emit('user.created', User);
        //new user, push to mailer queue for confirmation
        var Notification = {
            mailTemplate : 'register-activate',
            to : {
                email : User.email,
                name : User.firstName + ' ' + User.lastName
            },
            subject : App.Lang.get('emails.auth.customerSignUpSubject',{userName: User.firstName + ' ' + User.lastName,siteName:App.Config.app.siteName}),
            data : {
                user : User
            }
        };

        //we need a method pushNotificationToQueue
        App.Queue.put('userCreated',Notification,function(err,jobID){
            App.Event.emit('user.verificationEmailSent',jobID);
        });

    });

    App.Event.on('user.activated',function(User){
        //user confirmed, add to MailChimp
        App.pmx.emit('user.activated', User);
        if (User.preferences.subscribeToNewsletter && App.Cache.AccountActivations[User.activation_code]){
            var location = App.Cache.AccountActivations[User.activation_code];
            var subscriber = {
                email : User.email,
                firstName : User.firstName,
                lastName : User.lastName,
                ip : location.ip,
                area : 'activation',
                postData : {},
                uid : User._id,
                location : {
                    country : location.countryName,
                    city : location.city,
                    latitude : location.latitude,
                    longitude : location.longitude
                }
            };

            App.Services['mcmsNodeNewsletter'].Mailchimp.subscribe(App.Config.services.mailchimp.defaultListId,subscriber,function(err,result){
                delete App.Cache.AccountActivations[User.activation_code];
                if (err){
                    var ret = {error : err};
                    if (err.name){
                        ret.error = err.name;
                    }
                    return console.log(err);
                }
                console.log('user subscribed to Mailchimp');

            });
        }
        //send welcome email or possible offers
    });

    App.Event.on('user.passwordReminder',function(User){
        var Notification = {
            mailTemplate : 'emails/auth/forgot-password',
            to : {
                email : User.email,
                name : User.firstName + ' ' + User.lastName
            },
            subject : App.Lang.get('emails.auth.customerForgotPasswordSubject',{siteName:App.Config.app.siteName}),
            data : {
                user : User
            }
        };

        //we need a method pushNotificationToQueue
        App.Queue.put('forgotPassword',Notification,function(err,jobID){
            App.Event.emit('user.forgotPasswordEmailSent',jobID);
        });
    });
});
