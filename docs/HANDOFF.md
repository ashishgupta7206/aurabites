# AuraBites Deploy Handoff

Copy-paste this entire doc to a fresh agent when starting a new session.
It is self-contained: assumes the agent has read access to this Windows
machine and Git Bash. No prior chat history needed.

---

## 1. Architecture (live as of 2026-05-13)

```
Browser
  ↓
Vercel (aurabites.co.in / www.aurabites.co.in)
  ├─ Static site (Vite/React/TS)
  └─ /api/:path*  ──proxied──>  http://ec2-3-109-89-244.ap-south-1.compute.amazonaws.com:8000/api/:path*
                                       │
                                       ▼
                                 AWS EC2 (t2.micro, ap-south-1)
                                 ├─ Ubuntu 26.04
                                 ├─ Java 17 (OpenJDK)
                                 ├─ systemd service: aurabites-backend
                                 └─ Spring Boot JAR @ /home/ubuntu/aurabites/current.jar
                                       │
                                       ▼
                                 Neon Postgres (Singapore, ap-southeast-1)
                                 ep-green-forest-aoc6did1-pooler.c-2.ap-southeast-1.aws.neon.tech
                                 (creds inside app.properties — see §2)
```

Cloudinary hosts product images (di1ichety).

---

## 2. Credentials + paths

### Local repos (Windows)

| Repo | Path | Branch typically on |
|---|---|---|
| Frontend main worktree | `C:\Users\ASHISH\aurabites` | `main` |
| Frontend claude worktree | `C:\Users\ASHISH\aurabites\.claude\worktrees\sharp-gates-20612c` | `claude/sharp-gates-20612c` |
| Frontend codex worktree | `C:\Users\ASHISH\.codex\worktrees\2d03\aurabites` | `codex/revamp-aurabites-landing-page` |
| Backend | `C:\Users\ASHISH\IdeaProjects\canvify-backend-2` | `main` |

In Git Bash these are:
- `/c/Users/ASHISH/aurabites`
- `/c/Users/ASHISH/aurabites/.claude/worktrees/sharp-gates-20612c`
- `/c/Users/ASHISH/.codex/worktrees/2d03/aurabites`
- `/c/Users/ASHISH/IdeaProjects/canvify-backend-2`

### GitHub repos (private)

- Frontend: https://github.com/ashishgupta7206/aurabites
- Backend: https://github.com/ashishgupta7206/canvify-backend-2

### SSH keys

| Key | Path | Use |
|---|---|---|
| EC2 root key | `~/Downloads/aurabites-prod-key.pem` | Manual SSH from this machine |
| CI/CD key (private) | `~/.ssh/aurabites-cicd` | Used by GitHub Actions secret `EC2_SSH_KEY` |
| CI/CD key (public) | `~/.ssh/aurabites-cicd.pub` | Already appended to `/home/ubuntu/.ssh/authorized_keys` on EC2 |

### EC2

```
Public DNS:  ec2-3-109-89-244.ap-south-1.compute.amazonaws.com
Elastic IP:  3.109.89.244
User:        ubuntu
App dir:     /home/ubuntu/aurabites
  ├─ releases/             # timestamped JARs (last 5 kept)
  ├─ incoming/             # SCP target during deploy
  └─ current.jar           # symlink → newest release

Service:     aurabites-backend  (systemd)
Service unit:/etc/systemd/system/aurabites-backend.service
Env file:    /etc/aurabites.env  (root:root, mode 600)
  - Optional overrides. SPRING_JPA_HIBERNATE_DDL_AUTO was set here
    historically but post-b7906fd it can also come from app.properties.

Security group:
  Port 22  : SSH (from My IP — may need re-add if user IP changes)
  Port 8000: Custom TCP from 0.0.0.0/0 — public API
```

### Vercel

- Project name: aurabites (or similar — see Vercel dashboard)
- Domain apex: aurabites.co.in → 307 redirect → www.aurabites.co.in
- The /api proxy lives in `vercel.json` at repo root. Current value:
  `http://ec2-3-109-89-244.ap-south-1.compute.amazonaws.com:8000/api/:path*`
- Vercel deploys automatically on push to `main`.

### Neon Postgres (DB)

- Region: ap-southeast-1 (Singapore — yes, different from EC2 region; ~30ms latency)
- Connection string lives in `application.properties` line 6:
  ```
  jdbc:postgresql://ep-green-forest-aoc6did1-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?user=neondb_owner&password=npg_Mn3UWg4IdfBX&sslmode=require&channelBinding=require
  ```
- DDL auto: `spring.jpa.hibernate.ddl-auto=update` (so adding entities → tables auto-create on boot)

### Other secrets (all in `application.properties` — NOT in env vars)

User explicitly chose to keep secrets in `application.properties` for now. Don't move them without asking.

| What | Key | Notes |
|---|---|---|
| JWT secret | `jwt.secret=a7d8...` | 64 hex chars, weak — rotate before real users |
| Razorpay test | `razorpay.key.id=rzp_test_...` | Test mode — swap to `rzp_live_` for prod |
| Razorpay webhook | `razorpay.webhook.secret=...` | |
| Shiprocket | `shiprocket.email`, `shiprocket.password` | |
| Mail | `spring.mail.host=smtp.gmail.com`, `spring.mail.password=...` | Gmail app-password |
| Cloudinary | `cloudinary.cloud-name=di1ichety`, api-key, api-secret | |

---

## 3. Current state (as of 2026-05-13 12:55 IST)

### Latest commits

| Repo | Commit | Status |
|---|---|---|
| Backend `main` | `b7906fd` "feat(backend): admin bootstrap + ddl-auto env var + expanded CORS + Cloudinary" | **Deployed to EC2** as `app-20260513-072303.jar` |
| Frontend `main` | `ca466ca` "fix(vercel): point /api proxy back to live EC2" | Vercel auto-deploying |

### Verified working

- ✅ `POST http://3.109.89.244:8000/api/products/search` returns 200 with real products
- ✅ Cloudinary product images load
- ✅ Neon DB has seeded products (5 jars), categories
- ✅ Spring Boot starts in ~24s on t2.micro
- ✅ Tables auto-created via `ddl-auto=update`

### Known broken / pending

1. **Backend GitHub Actions auto-deploy is NOT firing.** Empty commit at `514947a` was pushed 2026-05-13 but no new release landed on EC2. Possible causes:
   - GH Secrets `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` missing or wrong
   - Workflow yml has a parse error
   - Action disabled in repo settings
   - Check: https://github.com/ashishgupta7206/canvify-backend-2/actions

2. **`vercel.json` has historically been reverted** (Render URL came back twice). If `/api` returns "Not Found" after a Vercel deploy, first thing to check is `vercel.json` is still pointing at EC2.

3. **HTTP not HTTPS on API.** The EC2 backend only serves HTTP. Vercel proxies HTTPS→HTTP on its side which works. But if anyone calls EC2 directly from a browser at an HTTPS page, mixed-content blocked. Long-term: add nginx + Let's Encrypt on EC2, or front with CloudFront.

4. **No CI for frontend** — Vercel handles that automatically on push to `main`.

---

## 4. Manual deploy commands (copy-paste from Git Bash)

### Frontend
Just push to `main`. Vercel auto-deploys.
```bash
cd /c/Users/ASHISH/aurabites
git pull --ff-only
# make edits
git add -A
git commit -m "..."
git push origin main
```

### Backend — manual (when CI is broken)
```bash
cd /c/Users/ASHISH/IdeaProjects/canvify-backend-2

# 1) Build
./mvnw -B -DskipTests clean package

# 2) Upload JAR
scp -i ~/Downloads/aurabites-prod-key.pem \
  target/test-0.0.1-SNAPSHOT.jar \
  ubuntu@3.109.89.244:~/aurabites/incoming/app.jar

# 3) Atomic swap + restart + health check
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 'set -e
APP_DIR=/home/ubuntu/aurabites
TS=$(date +%Y%m%d-%H%M%S)
mv "$APP_DIR/incoming/app.jar" "$APP_DIR/releases/app-$TS.jar"
ln -sfn "$APP_DIR/releases/app-$TS.jar" "$APP_DIR/current.jar"
sudo systemctl restart aurabites-backend
sleep 8
sudo systemctl is-active aurabites-backend
curl -sS --max-time 8 -X POST -H "Content-Type: application/json" -d "{}" \
  -o /tmp/r.txt -w "HTTP %{http_code}\n" http://127.0.0.1:8000/api/products/search
head -c 300 /tmp/r.txt
# keep last 5 releases
ls -t "$APP_DIR/releases" | tail -n +6 | xargs -I {} rm -f "$APP_DIR/releases/{}"'
```

Expected: `HTTP 200` + a JSON body with `"success":true`.

If it boots slowly on t2.micro, poll for port:
```bash
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 \
  'for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
     if sudo ss -tln | grep -q :8000; then echo "up after $((i*5))s"; break; fi
     sleep 5
   done'
```

---

## 5. Diagnose backend CI auto-deploy

The workflow lives at `.github/workflows/deploy.yml` in the **backend** repo.

### Check 1 — does Actions show any runs?
Visit: https://github.com/ashishgupta7206/canvify-backend-2/actions

- No runs at all → workflow file is broken or Actions disabled
- Runs listed → click latest, see which step failed

### Check 2 — secrets
https://github.com/ashishgupta7206/canvify-backend-2/settings/secrets/actions

Must have exactly these three:

| Name | Value |
|---|---|
| `EC2_HOST` | `3.109.89.244` |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Full contents of `~/.ssh/aurabites-cicd` including BEGIN/END lines |

To re-paste `EC2_SSH_KEY`:
```bash
cat ~/.ssh/aurabites-cicd
```

### Check 3 — workflow file
```bash
cat /c/Users/ASHISH/IdeaProjects/canvify-backend-2/.github/workflows/deploy.yml
```
Should match what's in git. If `on: push: branches: [main]` got dropped, restore it.

### Check 4 — test the CI key from this machine
```bash
ssh -i ~/.ssh/aurabites-cicd -o StrictHostKeyChecking=accept-new ubuntu@3.109.89.244 'echo ok'
```
Should print `ok`. If `Permission denied`, the public key isn't in EC2's `~/.ssh/authorized_keys`. Append it:
```bash
PUB=$(cat ~/.ssh/aurabites-cicd.pub)
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 "echo '$PUB' >> ~/.ssh/authorized_keys"
```

### Trigger a deploy test
```bash
cd /c/Users/ASHISH/IdeaProjects/canvify-backend-2
git commit --allow-empty -m "ci: trigger auto-deploy test"
git push origin main
```
Then wait ~3 min and check:
```bash
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 'ls -la ~/aurabites/current.jar'
```
The symlink should point to a release whose timestamp matches today's UTC date.

---

## 6. Common operations

### Tail backend logs live
```bash
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 \
  'sudo journalctl -u aurabites-backend -f'
```

### Last 200 backend log lines
```bash
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 \
  'sudo journalctl -u aurabites-backend -n 200 --no-pager'
```

### Rollback backend to previous release
```bash
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 'set -e
APP_DIR=/home/ubuntu/aurabites
PREV=$(ls -t $APP_DIR/releases | sed -n 2p)
ln -sfn "$APP_DIR/releases/$PREV" "$APP_DIR/current.jar"
sudo systemctl restart aurabites-backend'
```

### Update a secret in /etc/aurabites.env
```bash
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 'sudo nano /etc/aurabites.env'
# after editing
ssh -i ~/Downloads/aurabites-prod-key.pem ubuntu@3.109.89.244 'sudo systemctl restart aurabites-backend'
```

### Inspect Neon DB rows directly (via psql)
```bash
PSQL_URL="postgresql://neondb_owner:npg_Mn3UWg4IdfBX@ep-green-forest-aoc6did1-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
psql "$PSQL_URL" -c '\dt'                   # list tables
psql "$PSQL_URL" -c 'select id, name from m_product limit 10;'
```

---

## 7. Pending todos

In rough priority order:

1. **Fix backend CI auto-deploy** (see §5). Until done, every backend change needs manual `mvnw + scp + ssh restart`.
2. **Run the codex jar-image prompt** at `docs/codex-prompts/fix-jar-images.md` (frontend repo). Regenerates the 5 jar PNGs from the approved PDFs in `~/Downloads/aurabites-labels/`. Fixes the typos on Peri-Peri ("Pa#h" → "Rich", "Rosated" → "Roasted") and Salt & Pepper ("Pioer" → "Fiber", "Nutnents" → "Nutrients", "Bune" → "Bone").
3. **HTTPS for the backend** — nginx + certbot on EC2 OR move behind CloudFront. Currently `/api` is HTTP only; Vercel papers over this for browser users, but it's fragile.
4. **Move secrets out of `application.properties`** — JWT, Razorpay, Shiprocket, Mail, Cloudinary. Use `${ENV_VAR}` with values in `/etc/aurabites.env`. User said "do not change app.prop" — so do this only after asking.
5. **Switch Razorpay to live keys** when ready to take real payments.
6. **Add a healthcheck endpoint** — `/actuator/health` would let the GH Actions workflow's health-check step actually pass. Right now it falls back to a `POST /api/products/search` which works but isn't ideal.

---

## 8. Useful URLs

| What | URL |
|---|---|
| Live site | https://aurabites.co.in (apex → www) |
| Direct API | http://3.109.89.244:8000/api/products/search (POST) |
| Backend repo | https://github.com/ashishgupta7206/canvify-backend-2 |
| Frontend repo | https://github.com/ashishgupta7206/aurabites |
| GH Actions | https://github.com/ashishgupta7206/canvify-backend-2/actions |
| Backend secrets | https://github.com/ashishgupta7206/canvify-backend-2/settings/secrets/actions |
| AWS Console (Mumbai EC2) | https://ap-south-1.console.aws.amazon.com/ec2/home?region=ap-south-1 |
| Neon dashboard | https://console.neon.tech |
| Vercel dashboard | https://vercel.com/dashboard |
| Cloudinary | https://console.cloudinary.com (acct: di1ichety) |

---

## 9. Rules of engagement (from the user)

- **Do not change `application.properties`.** User keeps secrets there on purpose.
- **Do not change `AuraMotionStage.tsx`** or any motion file. Perf is locked in there.
- **Caveman skill is installed at `~/.claude/skills/caveman/SKILL.md`** — terse output style, saves ~75% tokens. Already loaded when Claude reads the user-level skills dir.
- **Always commit + push** changes to all branches user is working on (`main`, `claude/sharp-gates-20612c`, sometimes `codex/revamp-aurabites-landing-page` which has its own work — don't force-merge).
- **The codex branch sometimes has its own commits the user authored.** Don't ff-merge it into `main` without checking the PR flow on GitHub.
