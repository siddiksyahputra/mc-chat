const userModel = require("../model/userModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(req, res) {
    try {
        const {password, userId} = req.body

        const user = await userModel.findById(userId)
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true
            });
        }

        const verifyPassword = await bcryptjs.compare(password, user.password)

        if(!verifyPassword){
            return res.status(400).json({
                message: 'Invalid password',
                error: true
            })
        }

        const tokenData = {
            id: user._id,
            email: user.email
        }
        
        const token = await jwt.sign(
            tokenData,
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        const cookieOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        }

        return res.cookie('token', token, cookieOption)
                 .status(200)
                 .json({
                     message: 'Login Successfully',
                     token: token,
                     success: true
                 });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
            error: true
        })
    }
}

module.exports = checkPassword;