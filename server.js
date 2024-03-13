const express = require('express');
const cors = require('cors');
const mongo  = require('mongoose');
require("dotenv").config();
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors(
  {origin: '*'
}));
app.use('/user',userRoutes);

app.listen(process.env.DEFAULT_PORT, () => {
  console.log(`Server started on ${process.env.DEFAULT_PORT}`);
  mongo.connect(process.env.MONGO_URI)
  .then((res)=>{
    console.log('Database connected');
  }).catch((err)=>{
    console.log('Error connecting to database', err);
  })
});