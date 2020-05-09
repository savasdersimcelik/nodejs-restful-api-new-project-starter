
/**
 * Şuanki zamanı unixtime olarak getirir.
 */
exports.unix = async () => {
    return new Date().getTime();
}

/**
 * Şuanki zamanı okunabilir olarak formatlayıp getirir.
 */
exports.toISOString = async () => {
    return new Date().toISOString();
}

/**
 * Şuanki tarihi okunabilir ve gereksiz işaretleri çıkartıp getirir.
 */
exports.toString = async () => {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

/**
 * Unix time ekleme yapar 
 * @param {Number} second: Unixtime ekleme yapılacak saniye türünden değer
 * @param {Boolean} to_convert: Oluşturulan değer okunabilir halde formatlanacak mı?
 */
exports.getTimeAdd = async (second, to_convert = false) => {
    var getTime = new Date().getTime();
    var add = getTime + (second * 1000);
    if (to_convert) {
        let c = await convert(add);
        return c
    }
    return add;
}

/**
 * @param {Number} unix: Unix time değeri
 */
const convert = async (unix) => {
    var date = new Date(unix);
    var years = date.getFullYear();
    var month = date.getMonth();
    var days = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = years + '-' + month + '-' + days + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}