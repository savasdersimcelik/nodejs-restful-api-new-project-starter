exports.unix = async () => {
    return new Date().getTime();
}

exports.toISOString = async () => {
    return new Date().toISOString();
}

exports.toString = async () => {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

exports.getTimeAdd = async (second, to_convert = false) => {
    var getTime = new Date().getTime();
    var add = getTime + (second * 1000);
    if (to_convert) {
        let c = await convert(add);
        return c
    }
    return add;
}

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