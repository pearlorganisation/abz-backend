import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";
import "./src/config/passport.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Session configuration
app.use(
  session({
    secret: "F5B47E896766EE2C", // Session secret
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

//Routes Imports
import authRouter from "./src/routes/auth.routes.js";
import { errorHandler } from "./src/utils/error/errorHanlder.js";

app.get("/", (req, res) => {
  res.status(200).send("APIs are working...");
});

// Routes
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

export { app };
