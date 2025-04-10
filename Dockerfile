# Giai đoạn 1: Build ứng dụng Vue
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Cài đặt Nginx với ứng dụng đã build
FROM nginx:stable-alpine
# Sao chép tệp cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Sao chép ứng dụng đã build từ giai đoạn trước
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Mở cổng 80
EXPOSE 80
# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"] 