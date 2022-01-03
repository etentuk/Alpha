release: python manage.py migrate
web: gunicorn alpha.wsgi --log-file - --log-level debug