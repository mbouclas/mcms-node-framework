module.exports = (function(App) {
    var moment = require('moment');

    return function(jobId,payload,callback){
        var mailTo = payload.to,
            subject = payload.subject;

        App.View.render('emails/notifications/adminContactForm.html',
            {Config : App.Config,Message : payload.data.message,moment : moment}, function(err, html) {
                if (err){
                    return callback(err);
                }

                var message = require(__dirname + '/Helpers/createEmail')(html,subject,App.Config.mail.admin.email,App.Config.mail.admin.name,mailTo.email,mailTo.name);

                App.Mail.send(message,{},function(err,result){
                    if (err){
                        console.log('Error : ',err);
                        return callback(err);
                    }

                    callback(null,jobId + ' done');
                });
            });



    }
});