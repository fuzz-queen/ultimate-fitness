const jwt = requre("jsonwebtoken");

const authRequired = (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        console.log("Token: ", token);
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        res.send(401).send({
            loggedIn: false,
            message: "ya gotta log in first pal"
        })
    }
    next();
}

module.exports = { authRequired };