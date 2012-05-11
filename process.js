var fs = require('fs');
var readStream = fs.createReadStream('./DBMQ_20120510_2328.log');

var Lazy = require("lazy");


var	m = {},
	pcq = {}, //populate candidate queue.
	fields,
	lastLine,
	database,
	qid,
	lastCq;

new Lazy(readStream).lines.forEach(function(line) {
			var l = line.toString();
			
			if(/In function CMessageReader::DoWork/.test(l)) {
				m = {};
				m.candidateQueues = [];
				m.errors = [];
				m.startTime = new Date(l.split(',')[1]);
			}
			else if(/In function CMessageReader::PopulateCandidateQueues/.test(l)) {
				pcq = {};
				pcq.startTime = new Date(l.split(',')[1]);
			} else if(/Done function CMessageReader::PopulateCandidateQueues/.test(l)) {
				pcq.endTime = new Date(l.split(',')[1]);
				m.candidateQueues.push(
					{
						startTime:pcq.startTime, 
						endTime:pcq.endTime, 
						duration:pcq.endTime-pcq.startTime, 
						queues: [],
						database : ''
					});
			} else if(/Producer Get/.test(l)) {
				m.endTime = new Date(l.split(',')[1]);
				m.id = parseInt(l.split(',')[3],10);
				m.duration = m.endTime - m.startTime;
				console.dir(m);
			} else if(/Database:/.test(l)) {
				database = l.split(',')[2].split(':')[1].replace(/\s*|\r/g,'');
			} else if(/Queue_Id =/.test(l)) {
				qid = parseInt(l.split(',')[2].split('=')[1]);
				lastCq = m.candidateQueues[m.candidateQueues.length-1];
				if(lastCq) {
					lastCq.database = database;
					lastCq.queues.push(qid);
				}
			} else if(/Message\s*\d*\s*found/.test(l)) {
				m.database = database;
				m.queueId = qid;
			} else if(/CMessageReader::DoWork threw _com_error/.test(1)) {
				m.errors.push({database: database, queueId : qId});
			}
			lastLine = l;
});
