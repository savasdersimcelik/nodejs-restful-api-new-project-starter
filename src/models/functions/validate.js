const mongoose = require('mongoose');

const validateId = mongoose.Types.ObjectId.isValid;
const objectId = mongoose.Types.ObjectId;

const exist = async (ids, model) => {
    try {
        if (!Array.isArray(ids))
            ids = [ids];
        let query = ids.map(item => {
            if (validateId(item))
                return { _id: objectId(item) };
            return null;
        }).filter(item => item != null);

        if (query.length == 0)
            return true;

        query = { $or: query };
        const count = await model.count(query);
        return count == ids.length;
    } catch (e) {
        return false;
    }
}



module.exports = { exist, validateId, objectId };