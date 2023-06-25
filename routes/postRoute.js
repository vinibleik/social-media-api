const router = require("express").Router();
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

/** CRUD posts */
router.post("/new", authController.authVerify, postController.newPost);
router.get("/related_posts/:id", postController.getRelatedPosts);

router
  .route("/:id")
  .get(postController.getPost)
  .put(
    authController.authVerify,
    postController.postPermission,
    postController.updatePost
  )
  .delete(
    authController.authVerify,
    postController.postPermission,
    postController.deletePost
  );

router.get("/:id/comments", postController.getPostComments);

module.exports = router;
