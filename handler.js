var fs = require('fs');

var args = process.argv.splice(2);



var readStream = fs.createReadStream(args[0]);

var Lazy = require("lazy");

var startTime, endTime, duration, messageId;


new Lazy(readStream).lines.forEach(function(line) {
			var l = line.toString(),
			fields = l.split(',');

			if(/Consumer start processing/.test(l)) {
				startTime = new Date(fields[1]);
			}
			if(/Consumer finish processing/.test(l)) {
				endTime =  new Date(fields[1]);
				messageId = /\d+/.exec(fields[2])[0];
				console.log("%d %d", messageId, endTime - startTime);
			}
		});

