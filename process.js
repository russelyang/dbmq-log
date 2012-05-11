var fs = require('fs');
var readStream = fs.createReadStream('./DBMQ_20120510_2328.log');

var Lazy = require("lazy");


var	lastHour = 0,
	lastMinute = 0,
	count = 0;

new Lazy(readStream).lines.forEach(function(line) {
			var l = line.toString();
			if(/Producer Get/.test(l)) {
				var fields = l.split(','),
					dt = new Date(fields[1]);
				var	hour = dt.getHours(),
					minute = dt.getMinutes();

				if(minute != lastMinute) {
					lastHour = hour;
					lastMinute = minute;

						console.log(lastHour + ':' + lastMinute + ' ' + count);
					count = 0;
				} else {
					count ++;
				} 
			}
		});
