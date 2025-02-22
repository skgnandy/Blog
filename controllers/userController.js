const User = require("../models/user");

async function signIn(req, res) {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", { error: "Incorrect Email or Password" });
    }
}

function renderSignIn(req, res) {
    return res.render("signin");
}

function renderSignUp(req, res) {
    return res.render("signup");
}

async function signUp(req, res) {
    const { fullName, email, password } = req.body;
    await User.create({ fullName, email, password });
    return res.redirect("/");
}

function logout(req, res) {
    res.clearCookie("token").redirect("/");
}

module.exports = {
    signIn,
    signUp,
    renderSignIn,
    renderSignUp,
    logout
};