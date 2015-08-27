module.exports = (function(App,Package) {
    var lo = require('lodash');

    return {
        name: 'UserCP',
        nameSpace: 'User',
        index: index,
        update: update,
        updateUserPassword : updateUserPassword
    };


    function index(req,res,next){
        return res.render('User/userCP.html',{activationMessage : req.flash('activationSuccess')});
    }

    function update(req,res,next){
        App.Connections.mongodb.models.User
            .update({_id : App.Helpers.MongoDB.idToObjId(req.user.uid)},App.Helpers.MongoDB.sanitizeInput(req.body.profile),function(err,raw){
                if (err){
                    return res.send(err);
                }

                req.user = lo.merge(req.user,req.body.profile);
                return res.send(req.user);
            });
    }

    function updateUserPassword(req,res,next){
        var newPassword = App.Crypt.make(App.Helpers.MongoDB.sanitizeInput(req.body.password));
        App.Connections.mongodb.models.User
            .update({_id : App.Helpers.MongoDB.idToObjId(req.user.uid)},{password: newPassword,passwordReminder :{}},function(err,raw){
                if (err){
                    return res.send(err);
                }

                return res.send(req.user);
            });

    }
});