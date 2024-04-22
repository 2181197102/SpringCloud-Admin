#!/usr/bin/env bash
rm package-lock.json
rm -rf node_modules/
rm -rf dist/

npm install --legacy-peer-deps --registry=https://registry.npmmirror.com

docker stop sc-nginx

docker rm sc-nginx

npm run build:prod

docker-compose -f docker-compose.yml up -d nginx
