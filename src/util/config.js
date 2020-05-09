module.exports = {
    projectName: "Nodejs Yeni Proje",
    mongoConnectionString: "mongodb://localhost:27017/node-new-project-start",
    secretKey: "&JxJf?nGatkj#cXApma8jf3U7evuXwd2",
    pagination: 10,
    base_url: "http://localhost:3000/",
    PORT: 3000,
    initialAdminAccount: {
        first_name: "Savaş Dersim",
        last_name: "Çelik",
        name: "Savaş Dersim Çelik",
        email: "admin@example.com",
        phone: "+905001234567",
        password: "7BJXH6HjE8",
    },
    netgsm: {
        sender: "GÖNDERİCİ ADI", // Netgsm Gönderici Adı
        usercode: "USER CODE", // Netgsm Kullanıcı Giriş Bilgisi
        password: "NETGSM ŞİFRE" // Netgsm Şifre
    },
    verification: {
        expiration_time: 900, // Doğrulama kodu son kullanım süresi saniye cinsinden
        sms: true, // SMS doğrulama sistemi aktif mi pasif mi ?
        email: true // Email doğrulama sistemi aktif mi pasif mi ?
    }
}
