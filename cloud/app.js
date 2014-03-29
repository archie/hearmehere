
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.

app.get('/hear', function(req, res) {
  res.render('hear', { success: true, data: null });
});

app.post('/hear', function(req, res) {

  var formdata = {
    'location_name': req.body.location_name,
    'location_type': req.body.location_type,
    'location_info': req.body.location_info,
    'latitude': parseFloat(req.body.latitude),
    'longitude': parseFloat(req.body.longitude)
  };

  Parse.Cloud.run('store_location', formdata, {
    success: function(hotspot) {
      res.render('hear', { success: true, data: formdata });
    },
    error: function(error) {
      console.error(error);
      res.render('hear', { success: false, data: formdata });
    }
  });
});

// Attach the Express app to Cloud Code.
app.listen();
