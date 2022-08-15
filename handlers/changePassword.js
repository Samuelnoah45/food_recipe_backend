const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginHandler = async (req, res) => {
 
  const credientials = req.body.input;
  const email = credientials.email;
  const newPassword = credientials.newPassword;
  console.log(credientials)
   let GET_USER = gql`
    query ($email: String!) {
    users(where: {email: {_eq: $email}}) {
      id
      name
      email
      password
     
    }}
  
  `;


  let CHANGE_PASSWORD = gql`
          mutation ($id:Int!,$password:String!){
          update_users(where: {id: {_eq: $id}}, _set: {password:$password}) {
          affected_rows
            returning{
            name
            email
            password
          }
        }
      }

`;
  
  let data = await apollo_client.query({
    query: GET_USER,
    variables: { email },
  });
  
  
  const user = data.data.users[0];
  console.log(user.id);
 
const id= user.id


  if (user) {

      const isValidPassword = await bcrypt.compare(
      credientials.oldPassword,
      user.password
      ) 
    console.log(isValidPassword)
    
    if (isValidPassword) {
      
      const password = await bcrypt.hash(newPassword, 12);

  let datat = await apollo_client.mutate({
    mutation: CHANGE_PASSWORD,
    variables: { id, password},
    });
      
      console.log(datat.data.update_users.returning[0].name)
      
      console.log(datat.data.update_users.returning.length)
      if (datat.data.update_users.affected_rows == 1) {
        console.log("affected rows =1");
         return res.json({ 
         message:"success"
       });
      }
      else {
        console.log("affected rows !=1");
        return res.json({
        message:"failed"
      })
      }
 

  }
    
  else {
console.log("there");
return res.json({
    message:"failed"
      })
    }

  }

  else {
    

return res.json({
    email: "",
    name: "",
    token: "",
    userId:-1
})

}

};

module.exports = loginHandler;
