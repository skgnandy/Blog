const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/signin", userController.renderSignIn);
router.get("/signup", userController.renderSignUp);
router.post("/signin", userController.signIn);
router.post("/signup", userController.signUp);
router.get("/logout", userController.logout);

module.exports = router;