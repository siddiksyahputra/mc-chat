const userModel = require("../model/userModel")
const bcryptjs = require("bcryptjs")

async function registerUser(req, res) {
    try {
        const {name, email, password, profile_pic } = req.body

        const checkEmail = await userModel.findOne({email})

        if (checkEmail){
            return res.status(400).json({
                message : "User already exist",
                error: true,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password,salt)

        const payload = {
            name,
            email,
            profile_pic,
            password : hashpassword
        }

        const user = new userModel(payload)
        const userSave = await user.save()

        return res.status(201).json({
            message : "User succesfully Created",
            data : userSave,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = registerUser