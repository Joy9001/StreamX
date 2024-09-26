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

router.get("/logout", async function (req, res, next) {
  try {
    await new Promise((resolve, reject) => {
      req.logout(function (err) {
        if (err) reject(err);
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      req.session.destroy(function (err) {
        if (err) reject(err);
        resolve();
      });
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to log out" });
  }
});

export default router;
