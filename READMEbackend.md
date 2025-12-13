# Sweet Shop Backend (Skeleton)

This is a starter backend skeleton for the Sweet Shop Management System.
It includes:
- Express + TypeScript
- Prisma ORM (Postgres)
- JWT auth skeleton
- Sample controllers and tests (Jest + Supertest)

## Quickstart (local)
1. Copy `.env.example` to `.env` and set DATABASE_URL & JWT_SECRET.
2. Start Postgres (e.g., via Docker).
3. Install deps:
   ```bash
   npm install
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Run migrations (create DB schema):
   ```bash
   npx prisma migrate dev --name init
   ```
6. Run dev server:
   ```bash
   npm run dev
   ```
7. Run tests:
   ```bash
   npm test
   ```

## Notes
- This skeleton focuses on the backend only. Frontend scaffold can be added similarly.
- Add AI co-author trailers in commits where you used AI.
