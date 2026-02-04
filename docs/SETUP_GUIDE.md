# Clipmun Setup Guide 🚀

To make the app fully functional (Production Ready), you need to set up the following services.

## 1. Environment Variables (`.env.local`)
Create a file named `.env.local` in the root directory and add the following:

```bash
# Vercel Postgres
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# Google Drive API (For Video Storage)
GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_DRIVE_FOLDER_ID="root_folder_id"

GEMINI_API_KEY="AIza..."
KIE_API_KEY="kie_..."

# Authentication (Login System)
AUTH_SECRET="any-long-random-string-at-least-32-chars"
ADMIN_PASSWORD="your-secure-password"
```

### 🚨 Troubleshooting: "missing_connection_string" Error
If you see this error on Vercel:
1.  Go to your **Vercel Project Dashboard**.
2.  Click the **Storage** tab.
3.  Click **Connect Store** -> Select your Postgres database -> **Connect**.
4.  **IMPORTANT:** Go to **Deployments** -> Click the three dots (...) on the latest deployment -> **Redeploy**. (Environment variables update only after redeployment).

---

## 2. Setting up Google Drive (Storage)
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., `Clipmun-AI`).
3.  Enable **Google Drive API**.
4.  Go to **Credentials** -> **Create Credentials** -> **Service Account**.
5.  Create a key (JSON) and download it.
6.  Open the JSON file:
    *   Copy `client_email` -> `GOOGLE_CLIENT_EMAIL`
    *   Copy `private_key` -> `GOOGLE_PRIVATE_KEY`
7.  **IMPORTANT:** Go to your Google Drive, create a folder for videos, and **SHARE** that folder with the `client_email` address (Give Editor permission).
8.  Copy the Folder ID from the URL (the random string at the end) -> `GOOGLE_DRIVE_FOLDER_ID`.

---

## 3. Setting up Database (Postgres)
1.  Go to [Vercel Dashboard](https://vercel.com).
2.  Import this project from GitHub.
3.  Go to **Storage** tab -> **Create Database** -> Select **Postgres**.
4.  Once created, click **.env.local** tab and copy all variables.
5.  Paste them into your local `.env.local` file.

---

## 4. Run Locally
```bash
npm run dev
```
