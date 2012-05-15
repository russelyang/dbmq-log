var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;


//var Lazy = require("lazy");

var con;

var db = new Db('test', new Server('ryang3', 27017, {}), {native_parser:false});
db.open(function(err, db){
	con = db;
	cb();
});

var cb = function() {
	con.collection('foo', function(err, col) {
		col.insert({'a':123});
	});
}

