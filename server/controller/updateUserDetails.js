const userModel = require("../model/userModel");
const bcryptjs = require('bcryptjs');

async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        // Temukan pengguna berdasarkan email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User  not found",
                error: true
            });
        }

        // Hash password baru
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        // Perbarui password pengguna
        user.password = hashPassword;
        await user.save();

        return res.status(200).json({
            message: "Password successfully reset",
            success: true
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
            error: true
        });
    }
}

module.exports = resetPassword;