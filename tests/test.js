var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/test");

mongoose.connection
    .on('connected', function () {
        console.log('** Mongoose connection open to ');
    })
    .on('disconnected', function () {
        console.log('Mongoose connection disconnected');
    })

/**
 * The schema of the log entry
 * @type {Mongoose.Schema}
 */
var LogEntrySchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    res: {
        type: Object
    },
    req: {
        type: Object
    }
});

var LogEntryModel = mongoose.model('Log', LogEntrySchema);

var LogEntryStream = require('bunyan-mongodb-stream')({ model: LogEntryModel });

var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: 'YourLogger',
    streams: [
        {
            stream: LogEntryStream
        }
    ],
    serializers: bunyan.stdSerializers
});

logger.info('2222222222222');

