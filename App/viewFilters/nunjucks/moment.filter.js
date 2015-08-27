var moment = require('moment');
module.exports = (function(App){
    return {
        name : 'moment',
        func : function(str, format) {
            if (!format){
                format = App.Config.dates.formats[App.Config.dates.default];
            }

            if (typeof App.Config.dates.formats[format] != 'undefined'){
                format = App.Config.dates.formats[format];
            }

            return moment(str).format(format);
        }
    };
});
