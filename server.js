// Ohayo niga da watachiwa mohammed yado dayski daro 
// So basiclly this project is about generating a shortLink for a Long given So each time a user access that shortUrl that direct him to our server like a proxy Server , Our Server gonna redirect him to the LongUrl that has been saved into our server cache and database to make sure that the work is bieng procced in the most elegent way possible !
// lets start with trying to make our routes and running the server connecting him to the database and the cache ! 
require("dotenv").config() ;
const express = require('express') ;
const app = express() ;
const mongoose = require("mongoose") ;
const PORT = process.env.PORT || 5500 ;
const path = require("path");

//1-Making Connection To Our DataBase !
const dbConnection = require("./data/dbConnection") ;
dbConnection() ;
//2-Making Connection To Our Redis Server ! 
const client = require('./data/rdConnection') ;
//we already connected to the redis server in the rdConnection File!

//3-Creating Our DataBase Schemas!
const longURLs = require("./data/longURLs") ;

//4-Making Some Controlle Middlewares ! 
app.use(express.json()) ; // to handle json contant !

app.use(express.static(path.join(__dirname , "public")));
/* there is more middlewares are comming next  */

//5-preaparing Our Routes !


app.use( '/' , require ("./routes/rout")) ;

app.use('/shorten' , require("./routes/shorten")) ;





app.listen ( PORT , () => {
      console.log(`The Server Is Up and Running In Port ${PORT}`)
})