const userModel = require("../model/userModel")
const bcryptjs = require('bcryptjs')

async function resetPassword(req, res) {
    try {
        const {newPassword} = req.body

        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(newPassword,salt)

        const payload = {
            newpassword : hashpassword
        }

        const user = new userModel(payload)
        const userSave = await user.save()

        return res.status(201).json({
            message : "Password Successfully reset",
            data : userSave,
            success: true
        })


    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
            error: true
        })
    }
}

module.exports = resetPassword;