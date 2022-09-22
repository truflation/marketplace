#!/bin/bash
exec gunicorn -b 0.0.0.0:8000 -w 4 tfi_orders:app --access-logfile=- --log-level="${ORDERS_LOGLEVEL:-warning}"

