const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const cloudinary = require("cloudinary").v2;
var base64Img = require('base64-img');

// Request Handler

cloudinary.config({
  cloud_name: "blue-sky",
  api_key: "188655986618161",
  api_secret: "NhcWeFvdk1zcsO3QqpuzOHl5aCA",
});

const uploadImage = async (req, res) => {
  try {
    const { base64String } = req.body.input;
     console.log(base64String.length);

    let secure_urls =[];
    let urls = [];
    for (let i = 0; i < base64String.length; i++){
       let data = await cloudinary.uploader.upload(base64String[i], {
      unique_filename: true,
      discard_original_filename: true,
      folder: "test", 
      timeout: 120000,
    });

    secure_urls.push(data.secure_url); 
    urls.push(data.url);
    console.log(urls);
    }
   

    // success
    return res.json({
      urls
    });
  } catch (error) {
    console.error(error);

      return res.json({
      urls:[],
    });


  }
};

module.exports = uploadImage;
