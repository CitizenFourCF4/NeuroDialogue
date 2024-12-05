import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
app = Celery('backend')
app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.task_queues = {
    'default': {
        'exchange': 'default',
        'routing_key': 'default',
    },
}

app.autodiscover_tasks()

