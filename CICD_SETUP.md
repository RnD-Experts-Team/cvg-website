# CVG Website — CI/CD Setup Guide

## Overview

Every push to `master` on GitHub automatically deploys to production via GitHub Actions SSH.

## GitHub Secrets Required

Go to: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|------------|-------|
| `SERVER_HOST` | `2.57.91.91` |
| `SERVER_USER` | `root` |
| `SERVER_PORT` | `22` |
| `SERVER_SSH_KEY` | Contents of `/root/.ssh/cvg_website_deploy` (private key) |

### Getting the private key value
```bash
cat /root/.ssh/cvg_website_deploy
```
Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) and paste it as the `SERVER_SSH_KEY` secret.

## Push Workflow File to GitHub

The `.github/workflows/deploy.yml` file is committed locally but needs to be pushed to GitHub.
You'll need a GitHub Personal Access Token (PAT) with `repo` scope:

```bash
cd /srv/apps/cvg_website
git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/RnD-Experts-Team/cvg-website.git
git push origin master
```

Or use SSH:
```bash
cd /srv/apps/cvg_website
git remote set-url origin git@github.com:RnD-Experts-Team/cvg-website.git
git push origin master
```

## How It Works

```
Developer pushes to master
        │
        ▼
GitHub Actions (ubuntu-latest)
        │
        │  SSH into VPS (2.57.91.91)
        ▼
/srv/apps/cvg_website/deploy.sh
        │
        ├── git pull origin master
        ├── docker compose build (with NEXT_PUBLIC_API_URL baked in)
        ├── docker compose up -d --force-recreate
        └── health check loop
```

## Manual Deploy

```bash
cd /srv/apps/cvg_website && ./deploy.sh
```

## Logs

```bash
docker logs cvg_website -f
tail -f /var/log/nginx/cvg.construction.error.log
```
