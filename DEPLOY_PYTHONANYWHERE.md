# Deploy NexGen Tuitors on PythonAnywhere Free

PythonAnywhere is a good free fit for this project because it supports Django,
SQLite, static files, and uploaded media files without needing a paid database.

## 1. Upload the project

Create a free account at PythonAnywhere, then upload or clone this project into:

```text
/home/YOUR_USERNAME/nexgentuitors
```

The folder that contains `manage.py` should be:

```text
/home/YOUR_USERNAME/nexgentuitors/nexgentuitors
```

## 2. Create a virtual environment

In a PythonAnywhere Bash console:

```bash
cd ~/nexgentuitors/nexgentuitors
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 3. Prepare Django

```bash
python manage.py migrate
python manage.py collectstatic
```

If you need to recreate the superuser on the live site:

```bash
python manage.py createsuperuser
```

## 4. Configure the Web app

In the PythonAnywhere **Web** tab:

1. Add a new web app.
2. Choose **Manual configuration**.
3. Choose Python 3.12.
4. Set **Source code** to:

```text
/home/YOUR_USERNAME/nexgentuitors/nexgentuitors
```

5. Set **Virtualenv** to:

```text
/home/YOUR_USERNAME/nexgentuitors/nexgentuitors/venv
```

## 5. Edit WSGI file

Open the WSGI file from the Web tab and replace its contents with:

```python
import os
import sys

path = '/home/YOUR_USERNAME/nexgentuitors/nexgentuitors'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'nexgentuitors.settings'
os.environ['DJANGO_DEBUG'] = 'False'
os.environ['DJANGO_ALLOWED_HOSTS'] = 'YOUR_USERNAME.pythonanywhere.com'
os.environ['DJANGO_SECRET_KEY'] = 'PASTE_A_LONG_RANDOM_SECRET_KEY_HERE'
os.environ['DJANGO_SESSION_COOKIE_SECURE'] = 'True'
os.environ['DJANGO_CSRF_COOKIE_SECURE'] = 'True'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

Replace `YOUR_USERNAME` with your PythonAnywhere username.

To generate a secret key in the PythonAnywhere Bash console:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and paste it into `DJANGO_SECRET_KEY`.

## 6. Static and media files

In the Web tab, add these static file mappings:

```text
/static/ -> /home/YOUR_USERNAME/nexgentuitors/nexgentuitors/staticfiles
/media/  -> /home/YOUR_USERNAME/nexgentuitors/nexgentuitors/media
```

## 7. Reload

Click **Reload** in the PythonAnywhere Web tab.

Your site will be live at:

```text
https://YOUR_USERNAME.pythonanywhere.com
```
