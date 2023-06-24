FROM nginx:1.17.1-alpine
COPY /dist/vocabulary /usr/share/nginx/html
