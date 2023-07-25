import os
import sys

from celery import Celery

def celery_client():
    return Celery('tasks',
                            broker=os.getenv("REDIS_BROKER", "redis://localhost:6379/0"),
                            backend=os.getenv("REDIS_BACKEND", "redis://localhost:6379/1"))

def schedule_task(task, title, description):
    return celery_client().send_task(f"tasks.{task}", [title, description]).get()

if __name__ == '__main__':
    try:
        print(schedule_task(sys.argv[1],sys.argv[2],sys.argv[3]))
    except Exception as exc:
        raise exc