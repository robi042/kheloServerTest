const https = require('https');
const http = require('http');
const request = require('request');
const Sequelize = require('sequelize');

const url = require('url');
const admin = require("firebase-admin");

var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
var serviceAccount = require('./khelo-5c666-firebase-adminsdk-01asf-4e4df32e46.json');
dotenv.config();

let h = {};
//h.argon2 = require('argon2');
h.bcrypt = require('bcryptjs');
h.jwt = require('jsonwebtoken');

h.moment = require('moment');
h.Sequelize = Sequelize;
h.dataUriToBuffer = require('data-uri-to-buffer');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prismappfcm.firebaseio.com"
});

h.send_notification = function(title, body, topic){
    let message = {
        notification: {
            title: title,
            body: body
        },
        topic: topic
    };
    admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
}

h.send_image_notification = function(title, body, topic,image){
    let message = {
        notification: {
            title: title,
            body: body,
            imageUrl: image
        },
        topic: topic
    };
    admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
    });
}


h.render_xhr = function(req, res, json_object, header=200){
    res.writeHead(header, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(json_object));
};

h.xhr_error = function(req, res, custom_message){
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({e:1, m:`${custom_message || 'Something went wrong'}`}));
};

h.generate_refer_code = function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$%&abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

// h.hash = async function(password){
//     const hash = await h.argon2.hash(password);                    
//     return hash;
// };

// h.verify = async function(actual, claimed){
//     return await h.argon2.verify(actual, claimed)
// };

h.hash = async function(password){
    var salt = await h.bcrypt.genSalt(10);
    const hash = await h.bcrypt.hash(password, salt);             
    return hash;
};

h.verify = async function(actual, claimed){
    console.log( await h.bcrypt.compare(actual, claimed))
    return await h.bcrypt.compare(actual, claimed)
    
};



// Legacy
h.process_post_input = function(req, res, function_obj){
    if (req.method == 'POST') {
        var body = '';        
        req.on('data', function (data) {
            body += data
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy()
        });
        req.on('end', function () {
            function_obj(req, res, body);
        });
    }
    else{
        h.render_xhr(req, res, {e:1});
    }
};

h.send_sms = function(pkt){
    let sms = {
            api: 'https://sms.solutionsclan.com/api/sms/send'
            ,api_key:'A000047d5088a0c-7350-4917-9fe7-fbfff08dcc22'
            ,type: 'text'
            ,sender:'8809612441646'
    };
    let processed_body = encodeURI(pkt.body);
    processed_body = processed_body.replace(/'/g, '%27');
    https.get(`${sms.api}?apiKey=${sms.api_key}&contactNumbers=${pkt.number}&senderId=${sms.sender}&textBody=${processed_body}`, (resp) => {    
        let data = '';      
        resp.on('data', (chunk) => {
            data += chunk;
        });              
        resp.on('end', () => {
            // let result = JSON.parse(data); 
            // console.log(result);
        });
    }).on("error", (err) => {
            console.log("MDL SMS Error: " + err.message);
    });
}

h.send_email = function(email, title, body){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MAIL_PASS
        }
    });
    
    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: title,
        text: body
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

exports.h = h;
//test
//hi