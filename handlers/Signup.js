const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randToken = require('rand-token')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

// var nodemailer = require('nodemailer');

const sendMail =  function (email,token)
{
    
    var email =email;
    var token = token;
 
const msg = {
  to: email, // Change to your recipient
  from: 'busibusi4545@gmail.com', // Change to your verified sender
  subject: 'Verify you email',
  html: '<strong><p>You requested for email verification, kindly use this <a href="https://skyfoodrecipe.netlify.app/verifying?token=' + token + '">link</a> to verify your email address</p></strong>',
}

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
    console.log("sent");
        return 0

  })
  .catch((error) => {
    console.log("error");
  
    console.error(error.response.body)
        return 1

  })
    
}

const signupHandler = async (req, res) => {

  const credentials = req.body.input;
  const vemail=credentials.email
  const verifyToken =jwt.sign(vemail, process.env.VERIFY_TOKEN, {
      algorithm: "HS256"
  })

  credentials.password = await bcrypt.hash(credentials.password, 12);
  console.log(verifyToken);
  
    const variables = {
    email: credentials.email,
    password:credentials.password,
    name: credentials.name,
    verificationToken: verifyToken
    
  };


  let data = await apollo_client.mutate({
    mutation: gql`
     mutation ($email: String!, $password: String!, $name: String!,$verificationToken:String!) {
      insert_users_one(object: {email:$email, name:$name, password:$password,verificationToken:$verificationToken}){
        id
        email
        name
      }
    }
    `,
    variables: variables,
    fetchPolicy: "no-cache" 
  });
  
  console.log(data.data.insert_users_one.id);


  payload = {
      "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["admin", "user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id":""+data.data.insert_users_one.id,
      }
  }

  const token = jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRETS, {
      algorithm: "HS256",
      expiresIn: Date.now() + 1 * 24 * 60 * 60 * 1000,
  })

  
  let data2 = await apollo_client.mutate({
    mutation: gql`
  mutation ($token: String!, $id: uuid!) {
  update_users(_set: {verificationToken: $token}, where: {id: {_eq:$id}}) {
    affected_rows
  }
}


    `,
    variables: {token:token,
         id:data.data.insert_users_one.id},
    fetchPolicy: "no-cache" 
  });
  
  console.log(data2); 
  const sent =  sendMail(vemail, token);
  
  if (sent != 0) {
    return res.json({
    userId:data.data.insert_users_one.id,
    token,
    email: data.data.insert_users_one.email,
    name: data.data.insert_users_one.name, 
    image:data.data.insert_users_one.image, 
  })

  }
  else {
     return res.json({
    userId:1,
    token:"",
    email:"",
    name: "", 
  })

}
    
};


module.exports = signupHandler;
