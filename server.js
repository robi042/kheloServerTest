console.log(" ############################ Khelo SERVER BOOT ############################ ");
const url = require('url');
var compression = require('compression')
const express = require('express');
const path = require('path');
const http = require('http');
const dotenv = require('dotenv');
const helmet = require('helmet');
const request = require('request');
var useragent = require('express-useragent');
var expressGoogleAnalytics = require('express-google-analytics');
var timeout = require('connect-timeout');
let router = require('./router');
const add_money_sub_admin = require('./route/add_money_sub_admin.js').route;
const h = require('./helper').h;


const app = express();
app.use(compression())
dotenv.config();
app.use(helmet());
app.use(useragent.express());
app.use(timeout('1000s'));
//app.use(haltOnTimedout);
app.use('/uploads', express.static('uploads'))
app.use('/sliders', express.static('sliders'))
app.use('/popups', express.static('popups'))
app.use('/products', express.static('products'))
app.use('/notifications', express.static('notifications'))
app.use('/promoters', express.static('promoters'))
app.use('/promoter_slider', express.static('promoterSlider'))
app.use('/ludo-app-slider', express.static('ludo_app_slider'))
app.use(express.static(__dirname + '/template'))


var analytics = expressGoogleAnalytics('UA-213757029-1');
app.use(analytics);
// app.use((req, res, next) => {
//   var parsed_url = url.parse(req.url,true);
// 			var pathname = parsed_url.pathname;
// 			var path_components = pathname.split('/'); 
//       if (process.env.NODE_ENV === 'production') {
//         if (req.headers.host === 'testv2.khelo.live/')
//             return res.redirect(301, 'https://testv2.khelo.live');
//         if (req.headers['x-forwarded-proto'] !== 'https')
//             return res.redirect('https://' + req.headers.host + req.url);
//         else
//             return next();
//     } else
//         return next();
// });
function haltOnTimedout(req, res, next){
  if (!req.timedout){
      next();
  }
}

// app.use(function(req, res, next){
//     res.setTimeout(60000, function(){
//         console.log('Request has timed out.');
//             res.send(408);
//         });

//     next();
// });

app.use(function(request, response, next)
{
  //console.log('%s %s', request.method, request.url);
  var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress
  //console.log('connection from: ' + ip);
  const start = Date.now();
  response.once('finish', () => {
      const duration = Date.now() - start; 
      console.log('%s %s', request.method, request.url + ' CF: ' + ip + " RS: " + duration + " ms");
     });
  next();
});

app.get('/', (req, res) => {
  res.send('Khelo is back!')
})

app.get('/play-store/privacy-policy', (req, res) => {
  res.sendFile('privacy_policy.html', {root:__dirname + '/template'})
})

app.get('/play-store/terms-and-conditions', (req, res) => {
  res.sendFile('terms_and_conditions.html', {root:__dirname + '/template'})
})

app.use('/api', require('./router'))
app.use('/sub-admin/add-money/v1/api', add_money_sub_admin)

let port = process.env.new_port || 5000;
app.listen(port,()=>{
  console.log(`Khelo are listening on port ${port}`);
});



