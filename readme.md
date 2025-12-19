Berikut **langkah lengkap membuat project Express.js + TypeScript dari nol**, versi **best practice 2025** dan cocok untuk production 🚀

---

## 1️⃣ Persiapan

Pastikan sudah terinstall:

```bash
node -v
npm -v
```

> Rekomendasi Node **v18+**

---

## 2️⃣ Buat folder project

```bash
mkdir express-ts-app
cd express-ts-app
npm init -y
```

---

## 3️⃣ Install dependency utama

```bash
npm install express
```

Dependency TypeScript & tooling:

```bash
npm install -D typescript ts-node-dev @types/node @types/express
```

---

## 4️⃣ Inisialisasi TypeScript

```bash
npx tsc --init
```

Edit `tsconfig.json` → **versi minimal optimal**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 5️⃣ Struktur folder (recommended)

```
express-ts-app/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   │   └── index.ts
│   └── controllers/
│       └── home.controller.ts
├── dist/
├── tsconfig.json
├── package.json
```

---

## 6️⃣ Buat file utama

### `src/app.ts`

```ts
import express from "express";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

export default app;
```

---

### `src/server.ts`

```ts
import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

### `src/routes/index.ts`

```ts
import { Router } from "express";
import { home } from "../controllers/home.controller";

const router = Router();

router.get("/", home);

export default router;
```

---

### `src/controllers/home.controller.ts`

```ts
import { Request, Response } from "express";

export const home = (req: Request, res: Response) => {
  res.json({
    message: "Express + TypeScript berhasil 🎉",
  });
};
```

---

## 7️⃣ Script di `package.json`

Edit bagian `"scripts"`:

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 8️⃣ Jalankan project

Mode development:

```bash
npm run dev
```

Buka browser:

```
http://localhost:3000
```

Output:

```json
{
  "message": "Express + TypeScript berhasil 🎉"
}
```

---

## 9️⃣ (Opsional tapi direkomendasikan)

### Install dotenv

```bash
npm install dotenv
```

Tambahkan di `server.ts`:

```ts
import "dotenv/config";
```

---

### Tambahkan ESLint (optional professional setup)

Kalau mau, saya bisa buatkan:

- ESLint + Prettier
- Struktur MVC / Clean Architecture
- Express + PostgreSQL / Redis
- Auth JWT / Session
- Deployment (PM2 + Nginx)

---

Kalau kamu mau, bilang saja:

> 🔹 **API CRUD**
> 🔹 **Express + PostgreSQL**
> 🔹 **Auth Login**
> 🔹 **Project siap production**

Nanti saya bikinkan step-by-step sesuai kebutuhanmu 👍
