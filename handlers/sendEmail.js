var nodemailer = require('nodemailer');

const sendMail =  function (email,token)
{
    
    var email =email;
    var token = token;
 
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'appdev@aastu.edu.et', // Your email id
            pass: '**Appdev#024680' // Your password
        }
    });
 
    var mailOptions = {
        from: 'appdev@aastu.edu.et',
        to: email,
        subject: 'Email verification - Tutsmake.com',
        html: '<p>You requested for email verification, kindly use this <a href="https://skyfoodrecipe.netlify.app/verifying?token=' + token + '">link</a> to verify your email address</p>'
 
    };
 
    mail.sendMail(mailOptions, function (error, info)
    {
        if (error) {
            return 1
        } else {
            return 0
        }
    });
}