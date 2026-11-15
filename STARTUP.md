# Fly Digital Client Dashboard

## Start the API

Open PowerShell in the project root:

```powershell
npm install
npm run dev
```

The API and static app run at:

```text
http://localhost:4173
```

Verify the API at:

```text
http://localhost:4173/api/dashboard
```

If port `4173` is already in use, start the API on port `4174` instead:

```powershell
$env:PORT="4174"
npm run dev
```

## Start the Next.js frontend

Keep the API terminal running. Open a second PowerShell window in the project root:

```powershell
cd next
npm install
cd ..
$env:FLY_BACKEND_URL="http://127.0.0.1:4173"
npm run next:dev
```

The frontend runs at:

```text
http://localhost:3000
```

If the API is running on port `4174`, use this instead:

```powershell
$env:FLY_BACKEND_URL="http://127.0.0.1:4174"
npm run next:dev
```

## Frontend pages

- Client dashboard: `http://localhost:3000/`
- Admin operations view: `http://localhost:3000/admin`

## Stop the servers

Press `Ctrl+C` in each terminal running a server.

## Optional verification

From the project root:

```powershell
npm test
npm run build
```

