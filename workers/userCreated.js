module.exports = (function(App) {
    return function(jobId,payload,callback){
        var mailTo = payload.to,
            subject = payload.subject;
        App.View.render('emails/auth/'+payload.mailTemplate+ '.html',{Config : App.Config,User : payload.data.user}, function(err, html) {
            if (err){
                return callback(err);
            }

            var message = require(__dirname + '/Helpers/createEmail')(html,subject,App.Config.mail.admin.email,App.Config.mail.admin.name,mailTo.email,mailTo.name);

            App.Mail.send(message,{},function(err,result){
                console.log('Error : ',err);
                console.log('Result ' ,result);
                callback(null,jobId + ' done');
            });
        });



    }
});