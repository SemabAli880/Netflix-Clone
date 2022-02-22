const router = require("express").Router();
const Movie  = require("../models/Movie");
const verifyToken = require("../verifyToken.js");

//Create

router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    if (req.body.password) {
        const newMovie=new Movie(req.body);
        try {
            const savedMovie=await newMovie.save();
            res.status(403).json(savedMovie )
            
        } catch (error) {
            res.status(500).json(error)
        }
    }
  
  } else res.status(403).json("You are not allowed");
});

//Update

router.put("/:id", verifyToken, async (req, res) => {
    if (req.user.isAdmin) {
      if (req.body.password) {
          try {
              const updatedMovie=await Movie.findByIdAndUpdate(
                  req.param.id,
                  {
                $set:req.body,  
              },
              {new:true}
              );
              res.status(200).json(updatedMovie)
              
          } catch (error) {
              res.status(500).json(error)
          }
      }
    
    } else res.status(403).json("You are not allowed");
  });

  //Delete

router.delete("/:id", verifyToken, async (req, res) => {
    if (req.user.isAdmin) {
      if (req.body.password) {
          try {
              await Movie.findByIdAndDelete(req.params.id);
              res.status(200).json("The Movie has been deleted...")
              
          } catch (error) {
              res.status(500).json(error)
          }
      }
    
    } else res.status(403).json("You are not allowed");
  });

  //Get 
  router.get("/find/:id", verifyToken, async (req, res) => {
      if (req.body.password) {
          try {
              const movie=await Movie.findById(req.params.id);
              res.status(200).json(movie);
              
          } catch (error) {
              res.status(500).json(error)
          }
      }
    
    } );
    //Get Random
  router.get("/random", verifyToken, async (req, res) => {
    const type=req.query.type;
    let movie;
        try {
            if (type==="series") {
           movie=await Movie.aggregate([
               {$match:{isSeries:true}},
               {$sample:{size:1}}
           ]);
        }else{
            movie=await Movie.aggregate([
                {$match:{isSeries:false}},
                {$sample:{size:1}}
            ]);
        }
        res.status(200).json(movie)
            
        } catch (error) {
            res.status(500).json(error)
        }
    
  
  } );

   //Get ALL

router.get("/", verifyToken, async (req, res) => {
    if (req.user.isAdmin) {
      if (req.body.password) {
          try {
              const movies= await Movie.find();
              res.status(200).json(movies.reverse() )
              
          } catch (error) {
              res.status(500).json(error)
          }
      }
    
    } else res.status(403).json("You are not allowed");
  });



module.exports = router;
