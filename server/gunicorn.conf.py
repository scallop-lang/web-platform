import os

log_path = "log"
if not os.path.exists(log_path):
    os.makedirs(log_path)

bind = "127.0.0.1:3000"
daemon = True
accesslog = os.path.join(log_path, "gunicorn.access.log")
errorlog = os.path.join(log_path, "gunicorn.error.log")
capture_output = True
loglevel = "debug"
