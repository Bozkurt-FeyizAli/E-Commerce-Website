#!/bin/bash

PORT=4200

# Port 4200'ü kullanan PID'yi bul
PID=$(lsof -ti tcp:$PORT)

if [ -n "$PID" ]; then
  echo "Port $PORT is in use by PID $PID. Killing it..."
  kill -9 $PID
else
  echo "Port $PORT is free."
fi

# Angular uygulamasını başlat
ng serve --port $PORT
