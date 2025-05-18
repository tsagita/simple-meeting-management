#!/bin/bash
(cd frontend && npm install && npm run dev) &
(cd backend && go run github.com/air-verse/air@latest)