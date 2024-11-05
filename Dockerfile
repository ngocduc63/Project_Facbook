# Sử dụng image chính thức của Node.js để build ứng dụng
FROM node:16-alpine AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng cho môi trường production
RUN npm run build

# Sử dụng image chính thức của Nginx để phục vụ các file build
FROM nginx:stable-alpine

# Copy các file build từ giai đoạn build vào thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy file cấu hình Nginx nếu cần (không bắt buộc)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose cổng 80 để truy cập vào container
EXPOSE 80

# Lệnh khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
