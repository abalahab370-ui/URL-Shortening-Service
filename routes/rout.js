const express = require ("express") ;
const router = express.Router() ;
const path = require("path") ;

router.get ( '/' , ( req , res ) => {
      try {
            return res.status(200).sendFile(path.join(__dirname , ".." , "public" , "index.html")) ;
      } catch (err) {
            console.error ( `Sir We have an error in Serving the Main Web page : ${err}`);
      }
} )



module.exports = router ;