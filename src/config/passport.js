import passport from "passport";
import { Strategy as OIDCStrategy } from "passport-openidconnect";

import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUTH_URL,
  AUTH0_TOKEN_URL,
  AUTH0_USERINFO_URL,
  AUTH0_ISSUER,
  AUTH0_CALLBACK_URL,
} from "./index.js";

passport.use(
  new OIDCStrategy(
    {
      issuer: AUTH0_ISSUER,
      authorizationURL: AUTH0_AUTH_URL,
      tokenURL: AUTH0_TOKEN_URL,
      userInfoURL: AUTH0_USERINFO_URL,
      clientID: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      callbackURL: AUTH0_CALLBACK_URL,
      scope: "openid profile email",
    },
    (issuer, sub, profile, accessToken, refreshToken, done) => {
      // The profile object contains the user's data (name, email, etc.)
      return done(null, profile); // You can store the profile in the session
    }
  )
);

// Serialize user information (store it in session)
passport.serializeUser((user, done) => done(null, user));

// Deserialize user (retrieve from session)
passport.deserializeUser((user, done) => done(null, user));
