const userModal = require('../model/userModel')

async function searchUser(req, res) {
    try {
        const {search} = req.body

        const query = new RegExp(search, "i", "g")
        const user = await userModal.find({
            "$or": [
                { name: query},
                { email : query}
            ]
        }).select("-password")

        return res.json({
            message : "All user",
            data : user,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = searchUser