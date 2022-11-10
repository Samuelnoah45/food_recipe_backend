const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");

const verifyEmail = async (req, res) =>
{ 
    // console.log(req.body.input.token);
    
  const token = req.body.input.token;
   let VERIFY_USER = gql`
 mutation ($token:String!){
  update_users(, _set: {verifyEmail:true },
    where: {verificationToken: {_eq:$token}}){
    returning{
    name
    id,
    email
    verificationToken
    image
    

    }
  }

}
  
  `; 



 let data = await apollo_client.mutate({
    mutation: VERIFY_USER,
    variables: { token },
    fetchPolicy: "no-cache" 

 });
   const user=data.data.update_users.returning[0]
    console.log(user);

  return res.json({
  userId:user.id,
  token:user.verificationToken,
  email:user.email,
  name: user.name, 
  image:user.image
})
    

}
module.exports = verifyEmail;
