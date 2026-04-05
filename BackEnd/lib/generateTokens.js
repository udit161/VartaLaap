import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
    });
};