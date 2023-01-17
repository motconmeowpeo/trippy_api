const User = require("../models/user")
const bcrypt = require('bcrypt');

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt)
            const newUser = await new User({
                username: req.body.username,
                password: hashed,
                email: req.body.email
            })

            const user = await newUser.save();
            res.status(200).json(user)
        }
        catch (err) {
            res.status(500).json(err)
        }
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                res.status(404).json("Wrong Username")
            }
            const validate = await bcrypt.compare(req.body.password, user.password)
            if (!validate) {
                res.status(404).json("Wrong password")
            }
            if (user && validate)
                res.status(200).json(user)
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
}
module.exports = authController