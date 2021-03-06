
/**
 * Gönderilen metinin tamamını küçük ve özel karakterlerden arındırır geri döner
 * @param {String} str: Slug hale getirilmek istenilen text metin 
 */
function string_to_slug(str) {
    var trMap = {
        'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h',
        'θ': '8', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3',
        'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f',
        'χ': 'x', 'ψ': 'ps', 'ω': 'w', 'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o',
        'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's', 'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y',
        'ΐ': 'i', 'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z',
        'Η': 'H', 'Θ': '8', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N',
        'Ξ': '3', 'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y',
        'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W', 'Ά': 'A', 'Έ': 'E', 'Ί': 'I',
        'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I', 'Ϋ': 'Y', 'ş': 's', 
        'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ç': 'c', 'Ç': 'C', 'ü': 'u', 'Ü': 'U',
        'ö': 'o', 'Ö': 'O', 'ğ': 'g', 'Ğ': 'G','ă': 'a', 'î': 'i', 'ș': 's',
        'ț': 't', 'â': 'a', 'Ă': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T', 'Â': 'A',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'А': 'A', 'Б': 'B',
        'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
        'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H',
        'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
        'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G',
        'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g', 'č': 'c', 'ď': 'd', 'ě': 'e',
        'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u', 'ž': 'z', 'Č': 'C',
        'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U',
        'Ž': 'Z', 'á': 'a', 'ä': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'í': 'i',
        'ľ': 'l', 'ĺ': 'l', 'ň': 'n', 'ó': 'o', 'ô': 'o', 'ŕ': 'r', 'š': 's',
        'ť': 't', 'ú': 'u', 'ý': 'y', 'ž': 'z', 'Á': 'a', 'Ä': 'A', 'Č': 'C',
        'Ď': 'D', 'É': 'E', 'Í': 'I', 'Ľ': 'L', 'Ĺ': 'L', 'Ň': 'N', 'Ó': 'O',
        'Ô': 'O', 'Ŕ': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U', 'Ý': 'Y', 'Ž': 'Z',
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's',
        'ź': 'z', 'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N',
        'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z', 'ā': 'a', 'č': 'c', 'ē': 'e',
        'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n', 'š': 's', 'ū': 'u',
        'ž': 'z', 'Ā': 'A', 'Č': 'C', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'I', 'Ķ': 'K',
        'Ļ': 'L', 'Ņ': 'N', 'Š': 'S', 'Ū': 'U', 'Ž': 'Z', 'أ': 'a', 'ب': 'b',
        'ت': 't', 'ث': 'th', 'ج': 'g', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th',
        'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
        'ظ': 'th', 'ع': 'aa', 'غ': 'gh', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l',
        'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'o', 'ي': 'y', 'ą': 'a', 'č': 'c',
        'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z',
        'Ą': 'A', 'Č': 'C', 'Ę': 'E', 'Ė': 'E', 'Į': 'I', 'Š': 'S', 'Ų': 'U',
        'Ū': 'U', 'Ž': 'Z', 'ђ': 'dj', 'ј': 'j', 'љ': 'lj', 'њ': 'nj', 'ћ': 'c',
        'џ': 'dz', 'đ': 'dj', 'Ђ': 'Dj', 'Ј': 'j', 'Љ': 'Lj', 'Њ': 'Nj', 'Ћ': 'C',
        'Џ': 'Dz', 'Đ': 'Dj', 'ç': 'c', 'ə': 'e', 'ğ': 'g', 'ı': 'i', 'ö': 'o',
        'ş': 's', 'ü': 'u', 'Ç': 'C', 'Ə': 'E', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O',
        'Ş': 'S', 'Ü': 'U', 'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e',
        'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
        'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'j', 'რ': 'r', 'ს': 's', 'ტ': 't',
        'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'g', 'ყ': 'y', 'შ': 'sh', 'ჩ': 'ch',
        'ც': 'c', 'ძ': 'dz', 'წ': 'w', 'ჭ': 'ch', 'ხ': 'x', 'ჯ': 'j', 'ჰ': 'h'
    };

    for (var key in trMap) {
        str = str.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
    }
    
    return str.replace(/[^-a-zA-Z0-9\s]+/ig, '-')
        .replace(/\s/gi, "-")
        .replace(/[-]+/gi, "-")
        .toLowerCase();
}

/**
 * Türkçe bir kelime ve cümleyi tamamı büyük karakterlere dönüştürüp geri döner
 * @param {String} str:  Dönüştürülecek metin
 */
function tr_upperCase(str) {
    str = str.replace(/^\s+|\s+$/g, '');
    var from = "abcçdefgğhiıjklmnoöprsştuüvyz";
    var to = "ABCÇDEFGĞHİIJKLMNOÖPRSŞTUÜVYZ";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    return str;
}

/**
 * Belirlenen karakter sayısı kadar rastgele değer üretir
 * @param {Number} length: Kaç karakterden oluşacak
 * @param {Boolean} numeric: Numaralar kullanılacak mı? 
 */
function generate_random_code(length, numeric = false) {
    var result = '';
    var characters = numeric ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    string_to_slug,
    tr_upperCase,
    generate_random_code
}