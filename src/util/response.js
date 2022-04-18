const { format_joi_error } = require('./error');
/**
 * Başarılı işlem cevabı oluşturmak için kullanılacak metot
 * @param {*} req 
 * @param {*} res 
 * @param {*} response: Response olarak dönülecek datalar
 * @param {*} message: Response olarak dönülecek mesaj
 */
const respond = (req, res, response, message = null) => {
    let success_message = "İşlem başarı ile gerçekleşti.";
    let res_message = response_message(req, message, 'success')
    if (res_message != null){
        success_message = res_message.message;
        error_code = res_message.code;
        error_key = res_message.key;
    }

    res.send({ status: true, response: response, message: success_message });
}

/**
 * Hatalı işlem cevabı için kullanılacak metot.
 * @param {*} req 
 * @param {*} res 
 * @param {Number} code: HTTP response kodu
 * @param {String} error: Response olarak dönülecek hata mesajı
 */
const respondWithError = (req, res, code = null, error = null, response = {}) => {

    let error_message = "Bilinmeyen bir hata meydana geldi";
    let error_code = code;
    let error_key = null;

    if (error == null) {
        let res_message = response_message(req, code, 'error')
        if (res_message != null){
            error_message = res_message.message;
            error_code = res_message.code;
            error_key = res_message.key;
        }else{
            error_message = "Hata mesajı bulunamadı!";
            error_code = 1;
            error_key = "not_found_message_key";
        }
    } else if (typeof error == "string") {
        error_message = error;
        error_code = code;
    } else if (typeof error == "object" && error.path && error.message) {
        error = format_joi_error(error);
        first_key = Object.keys(error)[0];
        error_message = error[first_key];
        error_code = code;
    }

    res.send({ status: false, key: error_key, code: error_code, message: error_message, response: response });
}

const response_message = (req, key, file) => {
    console.log(req.lang);
    let messages = null;
    try {
        messages = require('../languages/' + req.lang + '/' + file + '.json');
    } catch (error) {
        return null;
    }

    if (messages[key] != undefined) {
        return messages[key];
    }
    return null;
}

module.exports = {
    respond,
    respondWithError,
    response_message
}