const express = require('express');
const axios = require('axios');
const app = express();
const port = 4040;
const cors = require('cors');
const nodemailer = require('nodemailer');
const database = "http://localhost:3500/";


// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// Registration endpoint
app.post('/register', async (req, res) => {
    const {firatname,lastname,email, password } = req.body;
    try {
      const userCheckResponse = await axios.get(database+'users', {
        params: {
          email: email
        }
      });
  
      if (userCheckResponse.data.length > 0) {
        return res.status(409).send({ message: 'Email already exists' });
      }
  
      const newUser = { firatname,lastname,email, password };
      const createResponse = await axios.post(database+`users`, newUser);
  
      res.status(201).send({ message: 'User registered successfully', user: createResponse.data });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send({ message: 'Server error', error: error.message });
    }
  });


  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const response = await axios.get(database+'users', {
        params: { email: email }
      });
  
      const users = response.data;
  
      if (users.length > 0) {
        const user = users[0];

        if (password === user.password) {
          console.log("ok")
          res.status(200).send({ message: 'Login successful' });
        } else {
          res.status(401).send({ message: 'Invalid username or password' });
        }
      } else {
        res.status(401).send({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error during login:', error); // Log the error
      res.status(500).send({ message: 'Server error', error: error.message });
    }
  });
  
app.post('/post_data', async (req, res) => {
      
    try { 
      const newdate =req.body;
      const createResponse = await axios.post(database+`data`, newdate);
      
      res.status(201).send({ message: 'post successfully', user: createResponse.data });
    } catch (error) {
      console.error('Error during post:', error);
      res.status(500).send({ message: 'Server error', error: error.message });
    }
  });


app.get('/display_data', async (req, res) => {
    try {
      const response = await axios.get(database+'data');
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error connecting to JSON server');
    }
  });

  app.post('/sendemail', (req, res) => {
    const { buyerid ,to, subject, body } = req.body;
  
    // Create a transporter with nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: buyerid,
        pass: buyerid,
      },
    });
  
    // Define email options
    const mailOptions = {
      from: buyerid,
      to,
      subject,
      text: body,
    };
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'To send email make your email as less secure ' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).send({ message: 'Email sent successfully' });
      }
    });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
