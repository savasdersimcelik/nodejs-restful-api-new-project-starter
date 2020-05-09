

// Console Log
const Debug = (...params) => {
    console.log(...params);
}

// Joi Format Hataları
const format_joi_error = (error) => {
    const field_name = error.path + "_error";
    return { [field_name]: error.message };
}

const generic_error = (object) => {
    const { 0: name } = Object.keys(object);
    return { path: name, message: `Lütfen geçerli bir ${object[name]} girdiğinizden emin olun.` };
}

module.exports = {
    Debug,
    format_joi_error,
    generic_error
}