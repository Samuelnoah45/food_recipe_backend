const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randToken = require('rand-token')

var nodemailer = require('nodemailer');

const sendMail =  function (email,token)
{
    
    var email ="samuelnoah668@gmail.com";
    var token = token;
 
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'busibusi4545@gmail.com', 
            pass: 'gyizzfxluigoalum' //
        }
    });
 
    var mailOptions = {
        from: 'busibusi4545@gmail.com',
        to: email,
        subject: 'Email verification - skyrecipe.com',
        html: '<p>You requested for email verification, kindly use this <a href="http://localhost:7000/verifyEmail?token=' + token + '">link</a> to verify your email address</p>'
 
    };
 
    mail.sendMail(mailOptions, function (error, info)
    {
      if (error) {
     console.log(error);
        return 1
        
      } else {

     console.log("wowowoowowow");
        
            return 0
        }
    });
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

  
   
  const sent =  sendMail(vemail, verifyToken);
  
  if (sent != 0) {
    return res.json({
      userId:data.data.insert_users_one.id,
    token,
    email: data.data.insert_users_one.email,
    name: data.data.insert_users_one.name, 
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
