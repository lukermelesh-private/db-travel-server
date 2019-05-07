var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const users = [
  {
    id: '1',
    type: 'regular',
    availability: [{from: new Date('2019-04-21T00:00:00').getTime(), to: new Date('2019-04-01T00:00:00').getTime()}],
    trips: ['1', '2']
  }
];

const trips = [
  {
    id: '1',
    travelers: ['1'],
    from: new Date('2019-05-11T00:00:00').getTime(),
    to: new Date('2019-05-18T00:00:00').getTime(),
    department: 'R&D',
    destination: 'Kaunas',
    details: {
      userId: '1',
      tickets: 'Lietuvos Gelezinkeliai',
      apartments: ['1'],
      status: 'approved'
    }
  },
  {
    id: '2',
    travelers: ['1'],
    from: new Date('2019-05-19T00:00:00').getTime(),
    to: new Date('2019-05-22T00:00:00').getTime(),
    department: 'R&D',
    destination: 'Riga',
    details: {
      userId: '1',
      tickets: 'Air Baltic',
      apartments: ['2'],
      status: 'pending'
    }
  }
];

app.use('/user/:userId', function (req, res) {
  res.send(users.find(user => user.id === req.params.userId))
});


app.use('/trips/:userId', function (req, res) {
  const user = users.find(user => user.id === req.params.userId);
  if (!user) {
    res.send(createError())
  }
  res.send(trips.filter(trip => user.trips.includes(trip.id)))
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
