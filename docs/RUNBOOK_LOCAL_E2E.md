# Local End-to-End Runbook

## 1) Start infrastructure
```bash
docker compose -f docker-compose.local.yml up -d
```

## 2) Backend setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## 3) Worker setup (new terminal)
```bash
cd backend/worker-service
npm install
npm run dev
```

## 4) Frontend setup (new terminal)
```bash
cd frontend
npm install
npm run dev
```

## 5) Smoke verify
- Open frontend and submit one payment flow.
- Verify backend API logs transaction/payment acceptance.
- Verify worker logs queued job processing.
- Verify Redis and Postgres health.

## 6) Teardown
```bash
docker compose -f docker-compose.local.yml down
```
