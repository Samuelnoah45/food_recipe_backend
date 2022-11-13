const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const sendGrid = async (req, res) => {
 
const msg = {
  to: 'samuelnoah668@gmail.com', // Change to your recipient
  from: 'busibusi4545@gmail.com', // Change to your verified sender
  subject: 'Verify you email',
 
  html: '<strong><p>You requested for email verification, kindly use this <a href="https://skyfoodrecipe.netlify.app/verifying?token=' + token + '">link</a> to verify your email address</p></strong>',
}

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error.response.body)
  })
}

module.exports=sendGrid;