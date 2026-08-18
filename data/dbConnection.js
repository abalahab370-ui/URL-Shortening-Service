const mongoose = require("mongoose") ;

const DBconnection = async () => {
      try {
            await mongoose.connect(process.env.DATABASE_URI) ;
            console.log("Connected to the Database");
      } catch (err) {
            console.error(`Sir We Have A Problem In Connecting To the DataBase : ${err}`)
      }
} ;

module.exports = DBconnection ;