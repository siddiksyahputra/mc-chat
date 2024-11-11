const userModel = require("../model/userModel")

async function forgotPassword(req, res) {
    try {
        const {email} = req.body

        const checkEmail = await userModel.findOne({email}).select('-password')
        const generateVerificationCode = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };
        
        if (!checkEmail){
            return res.status(400).json({
                message : "User not exist",
                error : true
            })
        }

        const verificationCode = generateVerificationCode()
        return res.status(200).json({
            message : "Email verify",
            error: false,
            data : checkEmail,
            verifyCode : verificationCode
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = forgotPassword