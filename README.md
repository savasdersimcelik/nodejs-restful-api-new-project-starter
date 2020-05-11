# Yeni NodeJS API Projesi

    git clone https://github.com/savasdersimcelik/nodejs-new-project-start.git

Yeni bir NodeJS API projesi oluşturmak için kullanılabilecek basit bir yapı.


### Hedeflenenler
- [x] Kullanıcı kayıt sistemi
- [x] Kayıt sonrası doğrulama kodunu SMS olarak gönderme
- [x] Kayıt sonrası doğrulama kodunu Eposta olarak gönderme
- [x] Kullanıcıya gönderilen smslerin veritabanda saklanması
- [ ] Doğrulama kodunu tekrar gönder sistemi
- [ ] Hesap doğrulama sistemi
- [x] Şifremi unuttum ile Şifre sıfırlamak için doğrulama kodu gönderilmesi ( Eposta veya Telefon numarası )
- [ ] Yeni şifre belirleme
- [x] Kullanıcı giriş sistemi ( Telefon veya Eposta Adresi )
- [ ] Giriş yapan kullanıcının FCM ID değerini güncelleme
- [ ] Kullanıcıya Google Firebase FCM üzerinden bildirim gönderme
- [ ] Kullanıcı profil bilgilerini düzenleme
- [ ] Kullanıcı profil resmini değiştirme

# Ayarlar

### Root Admin Bilgileri
src -> util -> config.js Dosyası içerisinde bilgileri ( Aşağıda yer alan bilgiler ) kendinize göre değiştirin.
```json
initialAdminAccount: {
    "first_name": "Savaş Dersim",
    "last_name": "Çelik",
    "name": "Savaş Dersim Çelik",
    "email": "admin@example.com",
    "phone": "+905001234567",
    "password": "7BJXH6HjE8",
}
```

### Doğrulama Sistemleri
src -> util -> config.js Doğrulama sistemileri ile ilgili ayarlarınızı yapabilirsiniz.
```json
verification: {
    "required": false,
    "expiration_time": 900,
    "phone": false,
    "email": false
}
```
### Şifre Sıfırlama
src -> util -> config.js Şifre sıfırlama işlemleri ile ilgili ayarlarınızı yapabilirsiniz.
```json
forgot: {
    "phone": false,
    "email": false
}
```

### NetGSM Bilgileri
src -> util -> config.js Dosyası içerisinde netgsm bilgilerini kendinize göre değiştirin.
```json
netgsm: {
    "sender": "GÖNDERİCİ ADI",
    "usercode": "USER CODE",
    "password": "NETGSM ŞİFRE"
}
```

### SMTP Bilgileri
src -> util -> config.js Dosyası içerisinde netgsm bilgilerini kendinize göre değiştirin.
```json
nodemailer: {
    "host": "mail.example.com",
    "port": 587,
    "user": "info@example.com",
    "password": "MAİL ŞİFRESİ",
    "rejectUnauthorized": false,      
    "logo": "uploads/mail_logo.png"
}
```

# Kütüphaneler
- [@hapi/joi](https://www.npmjs.com/package/@hapi/joi)
- [axios](https://www.npmjs.com/package/axios)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [cors](https://www.npmjs.com/package/cors)
- [express](https://www.npmjs.com/package/express)
- [joi-objectid](https://www.npmjs.com/package/joi-objectid)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [lodash](https://www.npmjs.com/package/lodash)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [crypto-js](https://www.npmjs.com/package/crypto-js)

# Klasör Yapısı

    ├── src
        ├── helper                      # Yardımcı fonksiyonların yer aldığı klasör
        ├── middlewares                 # Arakatman fonksiyonların yer aldığı klasör
        ├── models                      # Veritabanı şemalarının yer aldığı klasör
        ├── routes                      # API Sorgularının işlendiği klasör
        ├── util                        # Diğer fonksiyonların yer aldığı klasör
        └── app.js
    └── index.js