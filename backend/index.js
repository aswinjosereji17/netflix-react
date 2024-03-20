const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
// const multer = require('multer');
const path = require("path");
const EmployeeModel =require('./models/Employee')
const bcrypt =require('bcrypt')
const jwt =require('jsonwebtoken')
const cookieParser =require('cookie-parser')


// Middleware
app.use(express.json());
app.use(cors({
  origin:["http://localhost:3000"],
  methods : ["GET", "POST"],
  credentials : true
}));
app.use(cookieParser());

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json("token wrong");
      } else {
        next();
      }
    });
  } else {
    return res.json("no token");
  }
};

app.get('/home', verifyUser, (req, res)=>{
  return res.json("Success")
})

// Home route
app.get('/', (req, resp) => {
  resp.send('App is Working');
});

app.use(express.static(path.join(__dirname, "public")));


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Netflix', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to database'))
  .catch(err => console.error(err));


app.post('/register',(req,res) =>{
  const{name,email,password}=req.body
  bcrypt.hash(password,10)
  .then(hash =>{
    EmployeeModel.create({name, email, password: hash})
    .then(users => res.json(users))
    .catch(err => res.json(err))
  }).catch(err => console.log(err.message))

  
})


app.post('/login',(req,res) =>{
  const {email,password} = req.body;
  EmployeeModel.findOne({email: email})
  .then(user =>{
    if(user){
      // if(user.password === password){
      //   res.json( 'Login successful' );
      // }
      // else{
      //   res.json({ message: 'Login not successful' });
      // }
      bcrypt.compare(password,user.password,(err, response) =>{
        if(err){
          res.json('no pass')
        }else{
          const token =jwt.sign({email : user.email}, "jwt-secret-key", {expiresIn : "1d"})
          res.cookie("token", token);
          res.json('Login successful')
        }
      })
    }else{
      res.json('noooooooooooooooooooooooooooo');
    }
  })
})


// Define a mongoose model for your posts
// mongoose.connect('mongodb://127.0.0.1:27017/Netflix', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Define a mongoose model for your posts
const Post = mongoose.model('Post', {
  title: String,
  body: String,
});

// API endpoint for saving a post
app.post('/save-post', async (req, res) => {
  const { title, body } = req.body;

  try {
    const newPost = new Post({ title, body });
    await newPost.save();

    res.status(200).json({ message: 'Post saved successfully' });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





app.listen(5000,()=>(console.log("hjgjasgkjsbakbchzbchjabsjcbjzhxc")))






