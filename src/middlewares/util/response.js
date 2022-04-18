
//Yanıt ve hata oluşturma için arakatman
const create_response_middleware = (send_success, send_error) => {
    const response_middleware = (req, res, next) => {
        res.respond = (response, message) => send_success(req, res, response, message);
        res.error = (code, error, response) => send_error(req, res, code, error, response);
        next();
    }
    return response_middleware;
}

module.exports = create_response_middleware;