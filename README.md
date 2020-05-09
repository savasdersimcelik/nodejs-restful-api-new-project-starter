# Yeni NodeJS API Projesi

    git clone https://github.com/savasdersimcelik/nodejs-new-project-start.git

Yeni bir NodeJS API projesi oluşturmak için kullanılabilecek basit bir yapı.

# Yapılacaklar
- Doğrulama kodunu SMS olarak gönderme
- Doğrulama kodunu Eposta olarak gönderme
- Kodu tekrar gönder sistemi
- Hesap doğrulama sistemi
- Şifremi unuttum sistemi
- Yeni şifre belirleme
- Kullanıcı giriş sistemi

# Kullanıcı Kayıt
- URL: http://localhost:3000/api/auth/register
- Metot: POST
```javascript
{
	"first_name": "Savaş Dersim",
	"last_name": "Çelik",
	"email": "savasdersimcelik@gmail.com",
	"phone": "05078614659",
	"password": "Savas-909"
}
```