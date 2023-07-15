authRouter.post("/login", async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
});

authRouter.get("/logout", async (req, res, next) => {
    try {
        res.clearCookie("token", {
            sameSite: "strict",
            httpOnly: true,
            signed: true

        });
        res.send({
            loggedIn: false,
            message: "Logged Out"
        })
    } catch (error) {
        next(error);
    }
})

module.exports = authRouter;