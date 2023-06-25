const router = require("express").Router();
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

router.post("/new", authController.authVerify, commentController.newComment);

router
  .route("/:id")
  .get(commentController.getComment)
  .put(authController.authVerify, commentController.updateComment)
  .delete(authController.authVerify, commentController.deleteComment);

module.exports = router;
