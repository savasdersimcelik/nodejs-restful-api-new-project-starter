const Path = require('path');

module.exports = {
    projectName: "Nodejs Yeni Proje",   // Projenin Adı
    mongoConnectionString: "mongodb://localhost:27017/node-new-project-start",  // MongoDB bağlantı adresi
    secretKey: "&JxJf?nGatkj#cXApma8jf3U7evuXwd2",  // Hash sistemi için güvenlik anahtarı
    jwt_expiration: 0,                  // JWT Token kullanım süresi saniye cinsinden ( İptal etmek için: 0)
    pagination: 10,                     // Search sisteminde listenecek içerisik sayısı
    base_url: "http://localhost:3000/", // Serverın çalıştığı domain veya ip adresi
    PORT: 3000,                         // Serverın çalıştığı port numarası
    initialAdminAccount: {
        first_name: "Savaş Dersim",     // Root yönetici adı
        last_name: "Çelik",             // Root yönetici soyadı
        name: "Savaş Dersim Çelik",     // Root yönetici tam adı
        email: "admin@example.com",     // Root yönetici eposta adresi
        phone: "05001234567",           // Root yönetici telefon numarası
        password: "7BJXH6HjE8",         // Root Yönetici Şifresi
    },
    verification: {
        required: true,                 // Doğrulama işlemi yapılmadan giriş yapılabilsin mi ?
        expiration_time: 120,           // Doğrulama kodu son kullanım süresi saniye cinsinden
        phone: false,                   // SMS doğrulama sistemi aktif mi pasif mi ?
        email: true                     // Email doğrulama sistemi aktif mi pasif mi ?
    },
    forgot: {
        old_password: false,            // Yeni şifre, eski şifre ile aynı olabilir mi? ( False: Olamaz True: Olabilir)
        expiration_time: 300,           // Yeni şifre değiştirme süresi saniye cinsinden
        phone: false,                   // Şifre sıfırlama işlemi telefon ile mi yapılacak
        email: true                     // Şifre sıfırlama işlemi eposta ile mi yapılacak
    },
    netgsm: {
        sender: "GÖNDERİCİ ADI",        // Netgsm Gönderici Adı
        usercode: "USER CODE",          // Netgsm Kullanıcı Giriş Bilgisi
        password: "NETGSM ŞİFRE"        // Netgsm Şifre
    },
    nodemailer: {
        host: "mail.dio.com.tr",        // Mail server host name
        port: 587,                      // Mail server port adresi
        user: "savas@dio.com.tr",       // Mail gönderilecek eposta adresi
        password: "Savas-909",          // Mail gönderilecek eposta adresi şifresi
        rejectUnauthorized: false,      
        logo: "uploads/mail_logo.png",  // Mail içerisindeki logo
        templates_dir: Path.resolve(__dirname, "../", "templates") // Mail temalarının bulunduğu klasör
    },
    uploads: {
        folder: "uploads/",                                             // Upload klasörünün adı
        path: Path.join(__dirname, "../../", "uploads"),                // Upload klasörü yolu
        files: {
            folder: "uploads/files/",                                   // File klasörünün adı
            path: Path.join(__dirname, "../../uploads/", "files")       // File klasörü yolu
        },
        thumbnail: {
            folder: "uploads/thumbnail/",                               // Thumbnail klasörünün adı
            path: Path.join(__dirname, "../../uploads/", "thumbnail")   // Thumbnail klasörü yolu
        }
    },
}
