require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

const TOKEN_TTL = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days, same as the token

// Shared cookie options so set/clear always match.
const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
};

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        secret,
        { expiresIn: TOKEN_TTL }
    );
}

function getUser(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
    cookieOptions,
};
