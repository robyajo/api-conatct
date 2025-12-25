# PANDUAN MEMBUAT PROJECT EXPRESS.JS BARU (STACK SAMA)

Jika Anda ingin membuat project baru dari awal dengan stack yang sama seperti repository ini, ikuti langkah-langkah berikut:

## 1. Inisialisasi Project

```bash
mkdir nama-project-anda
cd nama-project-anda
npm init -y
```

## 2. Install Dependencies

Install library utama:

```bash
npm install express cors dotenv helmet zod bcryptjs jsonwebtoken multer ioredis socket.io slugify uuid pg express-rate-limit
npm install @prisma/client
```

Install dev dependencies (TypeScript & Tools):

```bash
npm install -D typescript ts-node ts-node-dev @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/uuid @types/pg prisma nodemon
```

## 3. Setup TypeScript

Inisialisasi `tsconfig.json`:

```bash
npx tsc --init
```

Sesuaikan `tsconfig.json` (rekomendasi minimal):

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## 4. Setup Prisma

Inisialisasi Prisma:

```bash
npx prisma init
```

Ini akan membuat folder `prisma/` dan file `.env`. Edit `.env` dan `prisma/schema.prisma` sesuai kebutuhan database Anda.

## 5. Struktur Folder

Buat struktur folder standar:

```bash
mkdir src
mkdir src/controllers src/middleware src/routes src/services src/utils
touch src/index.ts src/server.ts
```

## 6. Setup Script (package.json)

Tambahkan script berikut ke `package.json`:

```json
"scripts": {
  "dev": "nodemon",
  "build": "tsc",
  "start": "node dist/src/index.js",
  "start:prod": "NODE_ENV=production node dist/src/index.js",
  "typecheck": "tsc --noEmit",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:deploy": "prisma migrate deploy",
  "db:seed": "prisma db seed"
}
```

## 7. Struktur Folder Project Saat Ini

Berikut adalah gambaran struktur folder `api-conatct` saat ini (yang penting saja):

```text
api-conatct/
├── prisma/
│   ├── migrations/      # File history migrasi database
│   ├── schema.prisma    # Skema database utama (Model User, Role, dll)
│   └── seed.ts          # Script seeding data awal (User, Permission, dll)
├── src/
│   ├── controllers/     # Logika bisnis (Auth, RBAC, User, Profile)
│   │   ├── authController.ts
│   │   ├── profileController.ts
│   │   ├── rbacController.ts
│   │   └── userController.ts
│   ├── middleware/      # Middleware Express (Auth Check, Error Handling)
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   └── visitor.ts
│   ├── routes/          # Definisi endpoint API
│   │   ├── auth.ts
│   │   ├── rbac.ts
│   │   └── user.ts
│   ├── schema/          # Validasi input (Zod schemas)
│   │   ├── auth-schema.ts
│   │   └── user-schema.ts
│   ├── utils/           # Helper functions
│   │   ├── pagination.ts
│   │   └── response.ts
│   ├── index.ts         # Entry point aplikasi
│   ├── prisma.ts        # Instance Prisma Client
│   ├── realtime.ts      # Setup Socket.io
│   ├── redis.ts         # Setup Redis connection
│   └── server.ts        # Setup Express App
├── uploads/             # Folder upload file statis (avatar, dll)
├── .env                 # Environment variables
├── package.json         # Dependencies & Scripts
└── tsconfig.json        # Konfigurasi TypeScript
```

---

# API Contact

API Contact adalah REST API berbasis Node.js + Express dengan:

- PostgreSQL via Prisma ORM
- Redis (opsional) untuk cache dan visitor stats
- JWT Auth + RBAC (roles & permissions)

Dokumen ini menjelaskan alur lengkap dari clone, development, sampai deploy.

## 1. Prasyarat

- Node.js LTS (>= 20.x disarankan)
- NPM (bawaan Node)
- PostgreSQL
- Redis (opsional, tapi direkomendasikan untuk fitur tertentu)
- Git

## 2. Clone Repository

```bash
git clone <URL_REPO_KAMU>
cd "REACT ROUTER v7/Contact/api-conatct"
```

Pastikan semua perintah berikut dijalankan dari folder `api-conatct`.

## 3. Install Dependencies

```bash
npm install
```

Ini akan menginstall:

- Dependencies runtime (Express, Prisma Client, JWT, dll)
- Dev dependencies (TypeScript, Prisma CLI, ts-node, dll)

## 4. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Lalu sesuaikan nilai:

- `PORT` – default `4000`
- `DATABASE_PROVIDER` – default `"postgresql"`
- `DATABASE_URL` – koneksi PostgreSQL kamu, contoh:
  - `postgresql://user:password@localhost:5432/db_contact?schema=public`
- `JWT_SECRET` – ganti dengan string random yang kuat
- `REDIS_URL` – misalnya `redis://localhost:6379` (opsional)

> Jika ingin memakai MySQL/MariaDB, bagian contoh di `.env.example` bisa diaktifkan dan sesuaikan `DATABASE_PROVIDER` + `DATABASE_URL` + konfigurasi host/user/password.

## 5. Menyiapkan Database Prisma

### 5.1. Generate Prisma Client

```bash
npm run prisma:generate
```

Ini akan menghasilkan client Prisma di `generated/prisma`, yang digunakan oleh `src/prisma.ts`.

### 5.2. Jalankan Migrasi (Development)

Untuk membuat semua tabel di database:

```bash
npx prisma migrate dev --name init
```

Atau gunakan script:

```bash
npm run prisma:migrate
```

Jika sudah pernah migrate dan ingin meng-apply migration ke environment lain (misalnya staging/production), gunakan:

```bash
npm run prisma:deploy
```

### 5.3. Seeding Data (Users, Role, Permission, Sample Profile)

Project ini sudah punya seeder Prisma di `prisma/seed.ts` yang akan:

- Membuat user:
  - Super Admin: `sa@sa.com` / password: `string`
  - Admin: `a@a.com` / password: `string`
  - User: `u@u.com` / password: `string`
- Membuat roles:
  - `super_admin`, `admin`, `user`
- Membuat permissions:
  - Global: `users.manage`, `roles.manage`, `permissions.manage`, `profiles.manage`
  - Posts: `posts.create`, `posts.update`, `posts.delete`, `posts.view`
  - Categories: `categories.manage`
  - Comments: `comments.manage`
- Mapping role–permission:
  - `super_admin` dapat semua permission
  - `admin` dapat permission manajemen dan akses penuh ke posts/categories/comments
  - `user` hanya `posts.view`
- Assign roles ke user super admin/admin/user
- Membuat 50 akun sample `profile_users` orang Indonesia

Jalankan:

```bash
npm run db:seed
```

Atau untuk reset penuh (drop data + migrate + seed):

```bash
npm run db:reset
```

## 6. Menjalankan Redis (Opsional tapi Direkomendasikan)

Jika ingin memakai Redis, tersedia `docker-compose.yml` di root `api-conatct`:

```bash
docker compose up -d
```

Ini akan menjalankan container Redis di `localhost:6379`. Pastikan `REDIS_URL` di `.env` sudah sesuai.

Jika Redis tidak tersedia:

- Aplikasi akan fallback ke in-memory cache (lihat log saat start).

## 7. Menjalankan Aplikasi di Mode Development

Script dev menggunakan `nodemon`:

```bash
npm run dev
```

Secara default, server akan berjalan di:

```text
http://localhost:4000
```

Saat start, `src/index.ts` akan:

- Load `.env`
- Inisialisasi `app` (Express) dari `src/server.ts`
- Membuat HTTP server
- Menginisialisasi modul realtime (Socket.io) via `initRealtime`
- Mengecek koneksi Redis (jika diaktifkan)

## 8. Endpoint Utama (Gambaran Singkat)

- Prefix auth:

  - `POST /api/auth/register` – register user (dengan confirm password)
  - `POST /api/auth/login` – login, mendapatkan `token` & `refreshToken`
  - `GET  /api/auth/me` – data user yang login
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh` – refresh access token
  - `PUT  /api/auth/password` – update password (current/new/confirm)
  - `PUT  /api/auth/profile` – update nama + email
  - `POST /api/auth/avatar` – upload avatar (form-data field `avatar`)

- Prefix RBAC (hanya `admin` / `super_admin`):
  - `/api/rbac/roles` – CRUD role
  - `/api/rbac/permissions` – CRUD permission
  - `/api/rbac/users/assign-role`, `/remove-role`
  - `/api/rbac/roles/assign-permission`, `/remove-permission`
  - `/api/rbac/users/assign-permission`, `/remove-permission`
  - `POST /api/rbac/users` – admin membuat user baru dengan role & permissions

> Detail implementasi bisa dilihat di `src/controllers/authController.ts`, `src/controllers/rbacController.ts`, `src/routes/auth.ts`, dan `src/routes/rbac.ts`.

## 9. Typecheck & Kualitas Kode

Sebelum build/deploy, jalankan TypeScript typecheck:

```bash
npm run typecheck
```

Jika muncul error, perbaiki dulu sebelum lanjut.

## 10. Build untuk Production

Build TypeScript ke JavaScript di folder `dist`:

```bash
npm run build
```

Ini akan menjalankan:

```bash
tsc
```

Hasil build utama ada di `dist/src/index.js`.

## 11. Menjalankan di Production (Tanpa Docker)

Pastikan:

- Environment `.env` di server production sudah benar (DATABASE_URL, JWT_SECRET, dll).
- Database sudah di-migrate:

```bash
npm run prisma:deploy
npm run db:seed   # optional, tergantung kebutuhan
```

Lalu build:

```bash
npm run build
```

Jalankan server production:

```bash
npm run start:prod
```

Atau manual:

```bash
NODE_ENV=production node dist/src/index.js
```

Untuk production yang lebih robust, bisa gunakan:

- PM2 / systemd untuk menjaga process tetap hidup
- Nginx/Reverse proxy di depan Node.js

## 12. Menjalankan dengan Docker (Hanya Redis)

Saat ini repo menyediakan `docker-compose.yml` hanya untuk Redis. Aplikasi Node.js masih dijalankan langsung di host.

Langkah:

1. Jalankan Redis:

   ```bash
   docker compose up -d
   ```

2. Pastikan `REDIS_URL` di `.env` cocok dengan URL container:

   ```env
   REDIS_URL=redis://localhost:6379
   ```

3. Jalankan API seperti biasa (`npm run dev` atau `npm run start:prod`).

Jika ingin full Docker (API + DB + Redis), bisa ditambahkan Dockerfile & compose tambahan.

## 13. Ringkasan Alur Cepat

1. Clone repo:
   ```bash
   git clone <URL_REPO_KAMU>
   cd "REACT ROUTER v7/Contact/api-conatct"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup `.env`:
   ```bash
   cp .env.example .env
   # lalu edit sesuai environment
   ```
4. Prisma:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate   # pertama kali
   npm run db:seed          # isi data awal (user, role, permission, profil)
   ```
5. (Opsional) Jalankan Redis:
   ```bash
   docker compose up -d
   ```
6. Development:
   ```bash
   npm run dev
   # API di http://localhost:4000
   ```
7. Production:
   ```bash
   npm run typecheck
   npm run build
   npm run prisma:deploy
   npm run start:prod
   ```

Dengan alur di atas kamu bisa:

- Setup development environment dari nol
- Memiliki data awal (super admin, admin, user, role, permission, profil)
- Menjalankan API di dev maupun production.
