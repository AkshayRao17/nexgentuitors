# Deploy NexGen Tuitors on Render

Render can host the Django web service for free. Important limitations:

- Free web services spin down after 15 minutes without traffic, so the first visit after inactivity can be slow.
- Render's filesystem is ephemeral by default. Uploaded event photos/videos stored in `/media/` can be lost after redeploys or restarts.
- Free Render Postgres databases expire after 30 days. For long-term free data, use an external free database provider such as Neon or Supabase.

## Files already added

- `requirements.txt`
- `build.sh`
- `render.yaml`
- Render-ready Django settings for `DATABASE_URL`, WhiteNoise, static files, and environment variables.

## Option A: Quick free Render deploy

This deploys the website itself for free. Use this if you only need a test/demo deployment.

1. Push this project to GitHub.
2. Go to Render: https://dashboard.render.com
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repo.
5. Select the folder that contains `render.yaml`.
6. Deploy.

Render will use:

```text
Build Command: bash build.sh
Start Command: gunicorn nexgentuitors.wsgi:application
```

Your site will be available at:

```text
https://nexgentuitors.onrender.com
```

or another Render-generated `.onrender.com` URL.

## Option B: Recommended free-ish setup for your Events feature

Because your admin uploads images/videos, the better free setup is:

- Render Free Web Service for Django
- Neon or Supabase free Postgres for database
- Cloudinary free account for uploaded images/videos

Without Cloudinary or a paid Render disk, uploaded media can disappear after Render restarts.

## Manual Render setup

If you do not use Blueprint:

1. New -> Web Service.
2. Connect your GitHub repo.
3. Runtime: Python.
4. Build Command:

```bash
bash build.sh
```

5. Start Command:

```bash
gunicorn nexgentuitors.wsgi:application
```

6. Add environment variables:

```text
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<generate a strong secret>
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
WEB_CONCURRENCY=4
DATABASE_URL=<your Postgres internal/external URL>
```

If you skip `DATABASE_URL`, the app falls back to SQLite, but SQLite is not safe for permanent Render data because the filesystem is ephemeral.

## Create superuser on Render

After deployment, open Render Shell and run:

```bash
python manage.py createsuperuser
```

Or create your requested admin:

```bash
python manage.py shell -c "from django.contrib.auth import get_user_model; User=get_user_model(); User.objects.filter(username='Kingakshay').delete(); User.objects.create_superuser(username='Kingakshay', email='kingakshay@nexgentuitors.local', password='Guardshiva')"
```

For a real live site, use a stronger password than `Guardshiva`.
