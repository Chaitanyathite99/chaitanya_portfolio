FROM node:22-alpine AS frontend

WORKDIR /app
COPY package.json server.mjs ./
COPY frontend ./frontend

ENV HOST=0.0.0.0 \
    PORT=5173 \
    API_HOST=api \
    API_PORT=8000

EXPOSE 5173
CMD ["node", "server.mjs"]

FROM python:3.12-alpine AS api

WORKDIR /app
COPY api.py ./

ENV API_HOST=0.0.0.0 \
    API_PORT=8000 \
    PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["python", "api.py"]

