const express= require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const ejs = require('ejs')
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const signupHandler = require("./handlers/Signup.js");
const loginHundler = require("./handlers/Login.js");
const uploadImage = require("./handlers/upload.js");
const changePassword = require("./handlers/changePassword")
const verifyEmail =require("./handlers/verifyEmail")
dotenv.config({path: "variables.env"});
var upload = multer();
const app = express();
var port = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({ limit: "50MB" }));
app.use(express.static('public'));
app.set('view engine', 'ejs');	

app.post("/Signup", signupHandler);
app.post('/upload',upload.array('image',3),uploadImage);
app.post('/login', loginHundler);
app.post('/changePassword', changePassword);
app.get('/verifyEmail',verifyEmail);


const server = http.createServer(app);
server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})

 async function upload () {
      const files = event.target.files
      const uploadList = []
      console.log(files)

      const readFileAsync = file => new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = evt => resolve(evt.target.result)
        reader.readAsDataURL(file)
      })

      for (let i = 0; i < files.length; i++) {
        uploadList.push(await readFileAsync(files[i]))
      }

      event.target.value = null

      console.log(uploadList)
    }
