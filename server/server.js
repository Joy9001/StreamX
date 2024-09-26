import connectMongo from "./db/connectMongo.db.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
// import cookieSession from "cookie-session";
import authRoute from "./routes/auth.js";
import passportStrategy from "./strategy/passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

dotenv.config();

connectMongo().then(() => {
  console.log("Connected to MongoDB");
});
passportStrategy();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  rolling: true,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
      collectionName: 'sessions',
  }),
})
app.use(sessionMiddleware)
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["cyberwolve"],
//     maxAge: 5 * 60 * 1000,
//   })
// );

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);

app.listen(5000, () => {
  console.log("listening port 5000");
});
