# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
ARG VITE_AUTH_BASE_URL
ARG VITE_PRODUCT_BASE_URL
ARG VITE_ORDER_BASE_URL
ARG VITE_PAYMENT_BASE_URL
ENV VITE_AUTH_BASE_URL=$VITE_AUTH_BASE_URL
ENV VITE_PRODUCT_BASE_URL=$VITE_PRODUCT_BASE_URL
ENV VITE_ORDER_BASE_URL=$VITE_ORDER_BASE_URL
ENV VITE_PAYMENT_BASE_URL=$VITE_PAYMENT_BASE_URL
COPY . .
RUN npm run build

# serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
