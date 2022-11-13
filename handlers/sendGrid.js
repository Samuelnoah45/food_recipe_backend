const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const sendGrid = async (req, res) => {
    console.log("sendgrid");
const msg = {
  to: 'samuelnoah668@gmail.com', // Change to your recipient
  from: 'busibusi4545@gmail.com', // Change to your verified sender
  subject: 'Verify you email',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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