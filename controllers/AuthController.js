const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken });
};
// @desc Register a new user
// @route POST /auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // 1. Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // 2. Check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // 3. Hash password
  const hashedPwd = await bcrypt.hash(password, 10);

  // 4. Create and store the new user
  const userObject = {
    username,
    password: hashedPwd,
    roles: roles?.length ? roles : ["User"],
    active: true,
  };

  const user = await User.create(userObject);

  if (user) {
    // 5. Generate tokens
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user.username,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Set secure cookie for refresh token (adjust for local dev)
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,        // ⚠️ change to true in production
      sameSite: "None",      // ⚠️ change to "None" with secure: true in prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Send accessToken in response
    res.status(201).json({ accessToken });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});



// access token is expired so we send refresh token to generate a new access token
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  //jwt.verify(token, secretOrPublicKey, [options, callback])
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      //   token expires
      if (err) return res.status(403).json({ message: "Forbidden" });

      // refreshtoken has username, we access it from the token itself
      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      res.json({ accessToken });
    })
  );
});

// For security purpose, we need to clear cookies
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //no content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.json({ message: "cookie cleared " });
});

module.exports = {
  login,
  refresh,
  logout,
  register
};
