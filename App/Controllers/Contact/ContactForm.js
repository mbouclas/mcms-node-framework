module.exports = (function(App,Package) {
    var packageName = Package.name,
        pageServices = App.Services['mcmsNodePages'].Page,
        categoryServices = App.Services['mcmsNodePages'].Category,
        Cache = {};

    return {
        name: 'ContactForm',
        nameSpace: 'Contact',
        index: index
    };

    function index(req,res,next){
        if (!req.body.contact){
            return res.send({success: false});
        }
        var Notification = {
            mailTemplate : 'emails/notifications/adminContactForm',
            to : {
                email : App.Config.mail.admin.email,
                name : App.Config.mail.admin.name
            },
            subject : App.Lang.get('emails.contactFormSubject',{siteName : App.Config.app.siteName}),
            data : {
                Message : req.body.contact
            }
        };

        if (req.body.contact.sku){
            Notification.subject = App.Lang.get('emails.quickContactProductSubject',{sku : req.body.contact.sku});
        }

        App.Queue.put('generalMailer',Notification,function(err,jobID){
            App.Event.emit('contactForm.emailSent',jobID);
            res.send({success:true});
        });
    }
});