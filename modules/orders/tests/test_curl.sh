#!/bin/bash
curl -X  POST http://localhost:8000/ \
   -H 'Content-Type: application/json' \
   -d '{"login":"my_login","password":"my_password"}'
