/*
 * https://github.com/tmshv/coupon
 * https://github.com/chrisvariety/discountable
 * https://github.com/ImanimalXI/inTrader
 * http://openexchangerates.github.io/money.js/
 * https://github.com/alubbe/named-routes
 * */




require('rootpath')();
var Mcms = require('./autoloader');
//load server


/*
* Hook any template engine changes here
*/





/*
* Hook any extra routes
*/


var server = Mcms.lift();
var Socket = Mcms.Io.sockets;


/*
Mcms.redis.client.get('workersCompleted',function(err,res){
  console.log(res);
});
*/


Mcms.Io.on('connection', function (socket) {
  console.log('socket is up');
});
