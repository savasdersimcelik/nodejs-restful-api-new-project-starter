
/**
 * Ara katmanda eğer sadece kullanıcıların erişimine açıksa 
 * Bearer token içerisinde gelen ID değerine sahip bir kullanıcının türünü kontrol eder.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const requires_user = async (req, res, next) => {
    const { client } = req;
    if (!client)
        return res.error(401, "Not authtenticated")

    if (client.type == "admin" || client.type == "user")
        return next();

    return res.error(403, "Not Allowed");
}


module.exports = requires_user;