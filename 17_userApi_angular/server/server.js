var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var userApi = require('./routes/users');
var authorize = require('./middleware/authorize');
var globalErrorHandler = require('./middleware/globalErrorHandler');
var cors = require('cors');
var mongoose = require('mongoose');
var cfg = require('./config');
var User = require('./models/user');
var dataGenerator = require('./config/dataGenerator');

// app setup
var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//setup db
mongoose.connect('mongodb://localhost/demo');
User.findOne(null, function(err, user){
    if(!user){
        // create inital data
        dataGenerator.fillDb();
    }
});

// middleware
// app.use(authorize('12345'));

// routes
app.use('/api/users', userApi);

// middleware - error handlers
app.use(globalErrorHandler());

app.use(express.static('app'));

// listen for incomming request
var server = app.listen(cfg.port, function(){
    console.log('Express server listening on port ' + server.address().port);
});
