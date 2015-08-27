var moment = require('moment');
module.exports = (function(App){
    return {
        name : 'toJson',
        func : function(obj) {
            return JSON.stringify(obj);
        }
    };
});
