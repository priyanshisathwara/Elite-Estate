import express from "express";
import { cityResult, loginUser, registerUser, resendResetPasswordMail, resetPassword, searchData, sendResetPasswordMail, verifyOtp } from "../controllers/authController.js";



const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", sendResetPasswordMail);
router.post("/resend-otp", resendResetPasswordMail);
router.post("/reset-password-form",resetPassword);
router.post("/search", searchData)
router.get("/places/name/:city", cityResult);  


export default router;
