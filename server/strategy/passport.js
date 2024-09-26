import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import User from "../model/users.model.js";
import mongoose from "mongoose";

dotenv.config();

const passportStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
        scope: ["profile", "email"],
        state: true,
      },
      async function (accessToken, refreshToken, profile, callback) {
        console.log("Google user profile:", profile);
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails[0].value;
        const provider = profile.provider;

        try {
          const finduser = await User.findOne({ googleId });
          if (!finduser) {
            console.log("New user detected. Creating new user...");
            const newUser = await User({ googleId, username: name, email });
            await newUser.save();

            const user = await User.findOne({ googleId });

            const userSession = {
              _id: user._id,
            };
            return callback(null, userSession);
          } else {
            console.log("User already exists. Reusing existing user...");
            const userSession = {
              _id: user._id,
            };
            return callback(null, userSession);
          }
        } catch (error) {
          console.log("Error during Google OAuth flow:", error.message);
          return callback(error, false);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passportStrategy;
