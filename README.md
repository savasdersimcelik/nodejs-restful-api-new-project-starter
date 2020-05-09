# Yeni NodeJS API Projesi

    git clone https://github.com/savasdersimcelik/nodejs-new-project-start.git

Yeni bir NodeJS API projesi oluşturmak için kullanılabilecek basit bir yapı.


### Hedeflenenler
- [x] Kullanıcı kayıt sistemi
- [x] Kayıt sonrası doğrulama kodunu SMS olarak gönderme
- [x] Kayıt sonrası doğrulama kodunu Eposta olarak gönderme
- [x] Kullanıcıya gönderilen smslerin veritabanda saklanması
- [ ] Kodu tekrar gönder sistemi
- [ ] Hesap doğrulama sistemi
- [ ] Şifremi unuttum sistemi
- [ ] Yeni şifre belirleme
- [ ] Kullanıcı giriş sistemi
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
    "expiration_time": 900,
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
- @hapi/joi
- axios
- bcrypt
- body-parser
- cors
- express
- joi-objectid
- jsonwebtoken
- lodash
- mongoose

# Klasör Yapısı

    ├── src
        ├── helper                      # Yardımcı fonksiyonların yer aldığı klasör
        ├── middlewares                 # Arakatman fonksiyonların yer aldığı klasör
        ├── models                      # Veritabanı şemalarının yer aldığı klasör
        ├── routes                      # API Sorgularının işlendiği klasör
        ├── util                        # Diğer fonksiyonların yer aldığı klasör
        └── app.js

# Kullanıcı Kayıt
- URL: http://localhost:3000/api/auth/register
- Metot: POST
```json
{
	"first_name": "Savaş Dersim",
	"last_name": "Çelik",
	"email": "savasdersimcelik@gmail.com",
	"phone": "05078614659",
	"password": "Savas-909"
}
```
