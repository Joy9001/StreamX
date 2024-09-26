import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/logout",
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", async (req, res, next) => {
  try {
    req.logout();
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }

      req.session = null;
      res.clearCookie("connect.sid");
      return res.status(200).json({ error: false, message: "Logged Out" });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
