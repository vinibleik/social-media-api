const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const queryParser = require("../helpers/queryParser");

/** Authentication */
router.post("/signup", authController.newAdminVerify, authController.signup);
router.post("/login", authController.login);

/** CRUD Users */
router.get("/email", userController.getUserByEmail);
router
  .route("/:id")
  .get(queryParser, userController.getUserById)
  .put(
    authController.authVerify,
    userController.userPermission,
    userController.updateUser
  )
  .delete(
    authController.authVerify,
    userController.userPermission,
    userController.deleteUser
  );

router.get("/:id/posts", queryParser, userController.getPosts);
router.get("/:id/likes", queryParser, userController.getUserLikes);

module.exports = router;
