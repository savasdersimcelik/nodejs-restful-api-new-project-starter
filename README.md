# Yeni NodeJS API Projesi

    git clone https://github.com/savasdersimcelik/nodejs-new-project-start.git

Yeni bir NodeJS API projesi oluşturmak için kullanılabilecek basit bir yapı.

# Hedeflenenler
- [x] Kullanıcı kayıt sistemi
- [ ] Doğrulama kodunu SMS olarak gönderme
- [ ] Doğrulama kodunu Eposta olarak gönderme
- [ ] Kullanıcıya gönderilen smslerin veritabanda saklanması
- [ ] Kodu tekrar gönder sistemi
- [ ] Hesap doğrulama sistemi
- [ ] Şifremi unuttum sistemi
- [ ] Yeni şifre belirleme
- [ ] Kullanıcı giriş sistemi
- [ ] Giriş yapan kullanıcının FCM ID değerini güncelleme
- [ ] Kullanıcıya Google Firebase FCM üzerinden bildirim gönderme
- [ ] Kullanıcı profil bilgilerini düzenleme
- [ ] Kullanıcı profil resmini değiştirme


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
