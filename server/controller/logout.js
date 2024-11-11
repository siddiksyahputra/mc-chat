async function logout(req, res) {
    try {
        const cookieOption = {
            httpOnly: true,
            secure: true,
            path: '/', 
        };
        
        return res.cookie('token', '', { ...cookieOption, maxAge: 0 }) // Set maxAge ke 0 untuk menghapus cookie
            .status(200)
            .json({
                message: 'Logout Successfully -- Session out',
                error: false 
            });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = logout;