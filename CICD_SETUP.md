# CVG Website — CI/CD Setup Guide

## How It Works

Every push to `master` triggers a GitHub Actions workflow that:
1. **Rsyncs** the new code from the GitHub Actions runner to the VPS (no git credentials needed on server)
2. **SSH**es into the VPS and runs `deploy.sh` to rebuild the Docker image and restart the container

```
Developer pushes to master
        │
        ▼
GitHub Actions (ubuntu-latest)
        │
        ├─ rsync code → /srv/apps/cvg_website/ (skips .env, node_modules, .next)
        │
        └─ SSH into VPS (31.220.58.147)
                │
                └─ deploy.sh
                        ├── docker compose build (NEXT_PUBLIC_API_URL baked in)
                        ├── docker compose up -d --force-recreate
                        └── health check loop
```

---

## Step 1 — Add GitHub Secrets

Go to: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|------------|-------|
| `SERVER_HOST` | `31.220.58.147` |
| `SERVER_USER` | `root` |
| `SERVER_PORT` | `22` |
| `SERVER_SSH_KEY` | See below ↓ |

### Getting the SSH private key

Run this on the VPS and copy the **entire** output as the `SERVER_SSH_KEY` secret:

```bash
cat /root/.ssh/cvg_website_deploy
```

The value should start with `-----BEGIN OPENSSH PRIVATE KEY-----`.

---

## Step 2 — Push the infrastructure files to GitHub

The `Dockerfile`, `docker-compose.yml`, `deploy.sh`, and `.github/workflows/deploy.yml`
are committed locally on the server but need to be pushed to GitHub.

The server's local `master` branch is rebased on top of the latest GitHub commits.
Push it from the server using a GitHub Personal Access Token (PAT):

```bash
cd /srv/apps/cvg_website

# One-time: set remote to use your PAT
git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/RnD-Experts-Team/cvg-website.git

# Push
git push origin master

# After pushing, reset remote URL (don't store token permanently)
git remote set-url origin https://github.com/RnD-Experts-Team/cvg-website.git
```

Or from your **local machine** (if you've pulled the server's commits):
```bash
git pull --rebase  # get server's infra commits
git push origin master
```

---

## Step 3 — Verify workflow is active

After pushing, go to: **GitHub repo → Actions**

You should see the "Deploy to Production" workflow. The next push to `master` will trigger it automatically.

---

## Manual Deploy (without GitHub Actions)

```bash
cd /srv/apps/cvg_website && ./deploy.sh
```

---

## Logs & Debugging

```bash
# Container logs
docker logs cvg_website -f
docker logs cvg_website --tail=50

# nginx logs
tail -f /var/log/nginx/cvg.construction.error.log
tail -f /var/log/nginx/cvg.construction.access.log

# GitHub Actions logs
# → GitHub repo → Actions → latest run → click failed step
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Workflow never triggers | `.github/workflows/deploy.yml` not in GitHub | Push infra commits (Step 2) |
| Workflow fails at rsync | Wrong `SERVER_HOST` or `SERVER_SSH_KEY` secret | Check secrets — host must be `31.220.58.147` |
| Container unhealthy after deploy | Build error or crash | `docker logs cvg_website --tail=50` |
| Site shows old content | Browser cache | Hard refresh (`Ctrl+Shift+R`) or clear cache |
