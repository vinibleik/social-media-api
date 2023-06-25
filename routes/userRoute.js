const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

/** Authentication */
router.post("/signup", authController.newAdminVerify, authController.signup);
router.post("/login", authController.login);

/** CRUD Users */
router.get("/email", userController.getUserByEmail);
router
  .route("/:id")
  .get(userController.getUserById)
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

module.exports = router;
