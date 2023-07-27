import os
import sys

from celery import Celery

def celery_client(broker_url, backend_url):
    return Celery('tasks',
                            broker=broker_url,
                            backend=backend_url)

def schedule_task(celery_client, task, title, description):
    return celery_client.send_task(f"tasks.{task}", [title, description]).get()

if __name__ == '__main__':
    try:
        client=celery_client(sys.argv[1],sys.argv[2])
        print(schedule_task(client, sys.argv[3],sys.argv[4],sys.argv[5]))
    except Exception as exc:
        raise exc