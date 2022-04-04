# NodeJS RESTful API New Project Starter

    git clone https://github.com/savasdersimcelik/nodejs-restful-api-new-project-starter.git

Yeni bir NodeJS RESTful API projesi oluşturmak için geliştirilmiştir.


### Hedeflenenler
- [x] Kullanıcı kayıt sistemi
    - [x] Eposta kullanılıyor mu diye kontrol ediliyor.
    - [x] Telefon numarası kullanılıyor mu diye kontrol ediliyor.
    - [x] Zorunlu alanların config dosyasından yönetilebilir hale getirildi
- [x] Kayıt sonrası doğrulama kodunu SMS olarak gönderme
    - [x] Eposta, Telefon veya Her ikisi aynı anda gönderilebilir. ( Config dosyasından ayarlanabilir. )
    - [x] Kodların son kullanma tarihleri sisteme ekleniyor.    ( Son kullanım süresi Config dosyasından ayarlanabilir )
- [x] NetGSM SMS şirketi entegrasyonu. ( SMS Gönderimi için ) 
    - [x] Kullanıcıya gönderilen smslerin veritabanda saklanması.
- [x] NodeMailler entegrasyonu. ( Mail Gönderimi için)
- [x] Doğrulama kodunu tekrar gönder sistemi
- [x] Hesap doğrulama sistemi.  ( Zorunluluk Config dosyasından ayarlanabilir. )
    - [x] Eposta adresi doğrulama  ( Zorunluluk Config dosyasından ayarlanabilir. )
    - [x] Telefon numarası doğrulama  ( Zorunluluk Config dosyasından ayarlanabilir. )
    - [x] Her ikiside zorunlu ilse biri tamamlandıktan sonra diğerine ait kodun gönderilmesi.
- [x] Şifremi unuttum sistemi
    - [x] Şifre sıfırlama işlemi eposta veya telefon numarası kullanılabilir ( Config dosyasından ayarlanabilir. )
    - [x] Doğrulama kodunun gönderilmesi
    - [x] Şifre sıfırlamak için özel anahtarın oluşturulması
    - [x] Şifre sıfırlamak için doğrulama sistemi
    - [x] Doğrulama sonrası şifre sıfırlama için son kullanım tarihi ile özel anahtarın oluşturulması.
    - [x] Yeni şifre belirlenmesi ve özel anahtarın geçerlilik süresinin kontrolü
    - [x] Yeni şifre eski şifre ile aynı olabilir mi kontrol edilmesi. ( Config dosyasından ayarlanabilir. )
- [x] Kullanıcı giriş sistemi ( Telefon veya Eposta Adresi )
    - [x] Süreli veya Süresiz Bearer token oluşturulması. ( Config dosyasından ayarlanabilir. )
    - [x] Doğrulama zorunlu ise kontrol sağlanıp kodun gönderilmesi ve yönlendirme
- [x] Giriş yapan kullanıcının FCM ID değerini güncelleme.
- [ ] Kullanıcıya Google Firebase FCM üzerinden bildirim gönderme.
- [ ] Kullanıcıya Özel SMS göndermebilme.
- [ ] Kullanıcı profil bilgilerini düzenleme.

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
    "old_password": false,
    "expiration_time": 300,
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
src -> util -> config.js Dosyası içerisinde SMTP bilgilerini kendinize göre değiştirin.
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
