# Library Management System

Bu proje, NestJS backend ve React frontend ile geliştirilmiş bir Kütüphane Yönetim Sistemidir.

## Proje Yapısı

- `backend/` - NestJS backend uygulaması
- `frontend/` - React + TypeScript frontend uygulaması

## Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn

## Kurulum ve Çalıştırma

### Backend

1. Backend dizinine gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Backend'i çalıştırın:
```bash
npm run start:dev
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

**Not:** Backend SQLite veritabanı kullanmaktadır ve `library.db` dosyası otomatik olarak oluşturulacaktır.

### Frontend

1. Yeni bir terminal açın ve frontend dizinine gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Frontend'i çalıştırın:
```bash
npm run dev
```

Frontend varsayılan olarak `http://localhost:3001` adresinde çalışacaktır.

## Özellikler

### Authentication (Kimlik Doğrulama)
- Kullanıcı kaydı (Register)
- Kullanıcı girişi (Login)
- JWT token tabanlı yetkilendirme
- Rol bazlı erişim kontrolü (Admin, User)

### Entities (Varlıklar)
1. **User** - Kullanıcılar (Admin, User rolleri)
2. **Book** - Kitaplar
3. **Author** - Yazarlar
4. **Category** - Kategoriler

### İlişkiler
- **Author → Books** (One-to-Many): Bir yazar birden fazla kitap yazabilir
- **Book ↔ Category** (Many-to-Many): Bir kitap birden fazla kategoriye ait olabilir, bir kategori birden fazla kitap içerebilir
- **User → Borrows → Books** (One-to-Many): Bir kullanıcı birden fazla kitap ödünç alabilir

### CRUD İşlemleri
Tüm entity'ler için (Books, Authors, Categories) frontend üzerinden:
- Create (Oluşturma)
- Read (Okuma/Listeleme)
- Update (Güncelleme)
- Delete (Silme)

## Kullanım

1. Frontend'i açtığınızda login sayfası görünecektir
2. Yeni bir kullanıcı oluşturmak için "Register" linkine tıklayın
3. Giriş yaptıktan sonra dashboard'a yönlendirileceksiniz
4. Dashboard'dan Books, Authors ve Categories sayfalarına erişebilirsiniz
5. Her sayfada yeni kayıt ekleyebilir, mevcut kayıtları düzenleyebilir ve silebilirsiniz

## API Endpoints

### Authentication
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi

### Books
- `GET /books` - Tüm kitapları listele
- `GET /books/:id` - Belirli bir kitabı getir
- `POST /books` - Yeni kitap oluştur
- `PATCH /books/:id` - Kitabı güncelle
- `DELETE /books/:id` - Kitabı sil

### Authors
- `GET /authors` - Tüm yazarları listele
- `GET /authors/:id` - Belirli bir yazarı getir
- `POST /authors` - Yeni yazar oluştur
- `PATCH /authors/:id` - Yazarı güncelle
- `DELETE /authors/:id` - Yazarı sil

### Categories
- `GET /categories` - Tüm kategorileri listele
- `GET /categories/:id` - Belirli bir kategoriyi getir
- `POST /categories` - Yeni kategori oluştur
- `PATCH /categories/:id` - Kategoriyi güncelle
- `DELETE /categories/:id` - Kategoriyi sil

**Not:** Tüm endpoint'ler (auth hariç) JWT token gerektirir.

## Veritabanı

Proje SQLite veritabanı kullanmaktadır. TypeORM `synchronize: true` modunda çalışmaktadır (sadece development için). Production ortamında migration kullanılmalıdır.

## Teknolojiler

### Backend
- NestJS
- TypeORM
- SQLite
- JWT (JSON Web Tokens)
- Passport.js
- bcrypt

### Frontend
- React 19
- TypeScript
- React Router
- Axios
- Vite

