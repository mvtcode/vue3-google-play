# Ứng dụng Vue MP3 Player từ Google Drive

## Tính năng chính

- Phát nhạc MP3 từ Google Drive trực tiếp trên trình duyệt
- Sử dụng Nginx làm proxy để khắc phục hạn chế CORS
- Xử lý redirect từ Google Drive một cách hiệu quả
- Giao diện người dùng đơn giản, dễ sử dụng

## Hướng dẫn triển khai với Docker

### Cách 1: Sử dụng Docker

```bash
# Build Docker image
docker build -t vue-mp3-player .

# Chạy container
docker run -d -p 80:80 --name vue-mp3-player vue-mp3-player
```

Sau khi chạy, truy cập ứng dụng tại: http://localhost

### Cách 2: Sử dụng Docker Compose

Tạo file `docker-compose.yml`:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - '80:80'
```

Chạy với Docker Compose:

```bash
docker-compose up -d
```

## Hướng dẫn triển khai với Nginx

### Bước 1: Build ứng dụng Vue

```bash
npm install
npm run build
```

### Bước 2: Cài đặt Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx
```

### Bước 3: Cấu hình Nginx

Sao chép file `nginx.conf` vào thư mục cấu hình Nginx:

```bash
# Ubuntu/Debian
sudo cp nginx.conf /etc/nginx/sites-available/vue-mp3-player
sudo ln -s /etc/nginx/sites-available/vue-mp3-player /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default # Tùy chọn: xóa cấu hình mặc định

# CentOS/RHEL
sudo cp nginx.conf /etc/nginx/conf.d/vue-mp3-player.conf
```

### Bước 4: Copy thư mục build vào Nginx

```bash
sudo mkdir -p /usr/share/nginx/html
sudo cp -r dist/* /usr/share/nginx/html/
```

### Bước 5: Khởi động lại Nginx

```bash
sudo systemctl restart nginx
```

### Bước 6: Kiểm tra ứng dụng

Mở trình duyệt và truy cập: `http://localhost`

## Cách hoạt động

- Ứng dụng sẽ sử dụng Nginx làm proxy để tải file MP3 từ Google Drive
- Cấu hình Nginx đã được thiết lập để:
  - Phục vụ ứng dụng Vue từ thư mục `/usr/share/nginx/html`
  - Chuyển tiếp yêu cầu API từ `/api/gdrive-proxy/{fileId}` đến Google Drive
  - Xử lý CORS và các vấn đề liên quan đến proxy
  - Xử lý redirect (status 303) từ Google Drive sang drive.usercontent.google.com
  - Theo dõi các chuyển hướng với location block đặc biệt (@handle_redirect)

## Xử lý lỗi phổ biến

### Lỗi 403 Forbidden

Vấn đề này xảy ra khi Google Drive chuyển hướng (redirect) yêu cầu từ domain drive.google.com sang drive.usercontent.google.com. Ứng dụng đã được cấu hình để:

1. Bắt mã trạng thái chuyển hướng (301, 302, 303, 307)
2. Xử lý redirect nội bộ trong Nginx để giữ lưu lượng qua proxy
3. Thiết lập các header phù hợp để tránh bị chặn bởi CORS

### Lỗi CORS

Cấu hình Nginx đã thêm các header CORS cần thiết để cho phép truy cập từ bất kỳ nguồn nào:

- Access-Control-Allow-Origin: \*
- Access-Control-Allow-Methods: GET, OPTIONS
- Access-Control-Allow-Headers: các header cần thiết

## Lưu ý

- Đảm bảo rằng Nginx có quyền truy cập internet để kết nối tới Google Drive
- Nếu cần triển khai trên HTTPS, bạn sẽ cần cấu hình SSL cho Nginx
- Nếu gặp lỗi 403 sau khi triển khai, hãy kiểm tra lại cấu hình Nginx đặc biệt là phần xử lý redirect
