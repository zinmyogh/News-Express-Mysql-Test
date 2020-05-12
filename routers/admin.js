const express = require("express");
const router = express.Router();
// const upload = require("../middlewares/upload");
const admin = require("../controllers/adminController");

router.get("/get/category", admin.getcategory);
router.post("/add/category", admin.addcategory);
router.put("/update/category", admin.updatecategory);
router.delete("/delete/category", admin.deletecategory);
router.post("/insert/adv", admin.insertadv);

module.exports = router;
