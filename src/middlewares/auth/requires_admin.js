
const requires_admin = async (req, res, next) => {
    const { client } = req;
    if (!client)
        return res.error(401, "Not authtenticated")

    if (client.type == "admin")
        return next();

    return res.error(403, "Not Allowed");
}


module.exports = requires_admin;