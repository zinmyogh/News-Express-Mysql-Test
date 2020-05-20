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
router.get("/gethotarticle", article.gethotarticle);
router.get("/getallarticle", article.fgetallarticle);
router.get("/getarticlebycategory", article.fgetarticlebycategory);
router.post("/getarticlebyid", auth(), article.getarticlebyid);
router.get("/getarticle", auth(), article.getarticle);
router.post("/postarticle", auth(), article.postarticle);
router.put("/updatearticle", auth(), article.updatearticle);
router.delete("/deletearticle", auth(), article.deletearticle);

module.exports = router;
