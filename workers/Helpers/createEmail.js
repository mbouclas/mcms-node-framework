module.exports = function(body,subject,fromEmail,fromName,toEmail,toName){
    return {
        "html": body,
        "subject": subject,
        "from_email": fromEmail,
        "from_name": fromName,
        "to": [{
            "email": toEmail,
            "name": toName,
            "type": "to"
        }],
        "headers": {
            "Reply-To": fromEmail
        }
    };
};