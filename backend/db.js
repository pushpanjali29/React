const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const mongoURI = "mongodb://0.0.0.0:27017/inotebook"

// const connectToMongo = async ()=>{
//     mongoose.connect(mongoURI, ()=>{
        
//       console.log("connected to mongo sucessfully!");
        
//     })
 
// }
// module.exports = connectToMongo;
const connectToMongo = () => {
    mongoose.connect(mongoURI, {
      connectTimeoutMS: 60000, // set timeout to 60 seconds
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
      console.error(err);
    });
  };
  module.exports = connectToMongo;
  
