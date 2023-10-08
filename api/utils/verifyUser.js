import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js';


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("TEST");
    if (!token) {
        return next(errorHandler(401, "Unauthorized"))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(403, "Forbidden"))
        }
        console.log("USER SEND", user);
        req.user = user
        next()
    })
}
