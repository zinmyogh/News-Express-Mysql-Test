const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const article = require("../controllers/articleController");

router.post(
  "/articleimage",
  auth(),
  upload.single("file"),
  article.articleimage
);
router.get("/getallarticle", article.fgetallarticle);
router.get("/getarticlebycategory", article.fgetarticlebycategory);
router.get("/getarticle", article.getarticle);
router.post("/postarticle", auth(), article.postarticle);
router.post("/deletearticle", auth(), article.deletearticle);

module.exports = router;
