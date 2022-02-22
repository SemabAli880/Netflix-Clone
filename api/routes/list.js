const router = require("express").Router();
const List = require("../models/List");
const verifyToken = require("../verifyToken.js");

//Create

router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(403).json(savedList);
    } catch (error) {
      res.status(500).json(error);
    }
  } else res.status(403).json("You are not allowed");
});

//Delete

router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(403).json("The list has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else res.status(403).json("You are not allowed");
});

//get

router.get("/", verifyToken, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.type;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
