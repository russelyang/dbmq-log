var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;


var Lazy = require("lazy");


var lazy = new Lazy;

lazy.on('data', function(x) {
	console.log(x);
	var db = new Db('test', new Server('ryang3', 27017, {}), {native_parser:false});
	db.open(function(err, db){
		db.collection('foo', function(err, collection) {
			collection.insert({'a':x});
			db.close();
		});
	});	
});
	  
[0,1,2,3,4,5,6,7,8,9,10].forEach(function (x) {
  lazy.emit('data', x);
});
	  


