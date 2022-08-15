const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");

const verifyEmail = async (req, res) =>
{ 
    
    const token = req.query.token;
   let VERIFY_USER = gql`
 mutation ($token:String!){
  update_users(, _set: {verifyEmail:true },
    where: {verificationToken: {_eq:$token}}){
    affected_rows
  }

}
  
  `; 

 let data = await apollo_client.mutate({
    mutation: VERIFY_USER,
    variables: { token },
 });
    
  
return res.render("../views/emailverfiy");
    

}
module.exports = verifyEmail;
