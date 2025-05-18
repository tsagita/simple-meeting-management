#!/bin/bash
set -e

git pull origin main

cd backend
go run github.com/air-verse/air@latest &
BACKEND_PID=$!

cd ../frontend
npm install
npm run dev

wait $BACKEND_PID
