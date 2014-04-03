
var express = require('express');
var app = express();

// Local development or production
var rootPath;
if ('local' == app.get('env')) {
  rootPath = __dirname + '/';
  app.use(express.static(__dirname + '/../public'));
} else {
  rootPath = 'cloud/';
}

// Includes
var foursquare = require(rootPath + 'foursquare');

// Generic configuration
app.set('views', rootPath + 'views');   // Specify the folder to find templates  
app.set('view engine', 'ejs');          // Set the template engine
app.use(express.bodyParser());          // Middleware for reading request body

// Routes
app.get('/', function(req, res) {
  res.render('hear');
});

app.get('/hear', function(req, res) {
  res.redirect(301, '/');
});

app.post('/', function(req, res) {

  var formdata = {
    'location_name': req.body.location_name,
    'location_type': req.body.location_type,
    'location_info': req.body.location_info,
    'latitude': parseFloat(req.body.latitude),
    'longitude': parseFloat(req.body.longitude)
  };

  Parse.Cloud.run('store_location', formdata, {
    success: function(hotspot) {
      // res.render('hear', { success: true, data: formdata });
      res.send(200, { message: 'Your place has been saved.' });
    },
    error: function(error) {
      console.error(error);
      // res.render('hear', { success: false, data: formdata });
      res.send(200, { message: 'Could not save place.' });
    }
  });

});

app.get('/internal/foursquare', function(req, res) {
  foursquare.suggestions(req, res);
});

// Run express
if ('local' == app.get('env')) {
  app.listen(3000);
} else {
  app.listen();
};

module.exports = app;