const { format_joi_error } = require('./error');

/**
 * Başarılı işlem cevabı oluşturmak için kullanılacak metot
 * @param {*} req 
 * @param {*} res 
 * @param {*} response: Response olarak dönülecek datalar
 * @param {*} message: Response olarak dönülecek mesaj
 */
const respond = (req, res, response, message) => {
    if (message == null)
        message = "İşlem başarı ile gerçekleşti.";
    res.send({ response, message });
}

/**
 * Hatalı işlem cevabı için kullanılacak metot.
 * @param {*} req 
 * @param {*} res 
 * @param {Number} code: HTTP response kodu
 * @param {String} error: Response olarak dönülecek hata mesajı
 */
const respondWithError = (req, res, code, error) => {
    if (typeof error == "string")
        error = { general_error: error };
    if (typeof error == "object" && error.path && error.message)
        error = format_joi_error(error);
    res.send(code, error);
}

module.exports = {
    respond,
    respondWithError
}