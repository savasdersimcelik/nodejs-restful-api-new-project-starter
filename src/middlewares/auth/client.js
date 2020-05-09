const client = async (req, res, next) => {
    const { auth } = req;
    let _user = {};
    if (!auth)
        return next();
    const { _id } = auth;
    if (!_id)
        return next();

    _user = await user.findById(_id);

    if (!_user)
        return next();
    req.client = _user;
    next();
}


module.exports = client;