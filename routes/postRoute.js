const router = require("express").Router();
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const queryParser = require("../helpers/queryParser");

router.post("/new", authController.authVerify, postController.newPost);
router.get("/related_posts/:id", queryParser, postController.getRelatedPosts);

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

router.get("/:id/comments", queryParser, postController.getPostComments);
router.get(
  "/:id/like",
  queryParser,
  authController.authVerify,
  postController.likePost
);
router.get("/:id/postlikes", queryParser, postController.getLikes);

module.exports = router;
