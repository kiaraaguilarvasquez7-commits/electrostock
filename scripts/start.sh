#!/bin/bash

cd /opt/electrostock/backend

pm2 start index.js --name electrostock
pm2 save