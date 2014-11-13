/*
 * https://github.com/tmshv/coupon
 * https://github.com/chrisvariety/discountable
 * https://github.com/ImanimalXI/inTrader
 * http://openexchangerates.github.io/money.js/
 * https://github.com/alubbe/named-routes
 * */




require('rootpath')();
var Mcms = require('./autoLoader');
//load server


/*
* Hook any template engine changes here
*/





/*
* Hook any extra routes
*/


var server = Mcms.lift(null,ready);
var Socket = Mcms.Io.sockets;


function ready(App){//we are soooo ready
  App.Log.info('ready');
//can do whatever you feel, like including some redis subs or beanstalk
  App.Io.on('connection', function (socket) {
    //require Socket files
  });
}



