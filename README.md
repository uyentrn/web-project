# Perfume E-Commerce Backend

Hệ thống Backend cho trang web bán nước hoa, được xây dựng với kiến trúc Layered Architecture, tối ưu hóa cho môi trường Serverless trên AWS.

## 1. Công nghệ sử dụng
- Language: Node.js (TypeScript)
- Framework: Serverless Framework
- ORM: Prisma
- Database: PostgreSQL (Managed via Supabase/Neon/RDS)
- Cloud Provider: AWS (Lambda, API Gateway, S3)

## 2. Cấu trúc dự án

```text
perfume-store-backend/
├── src/
│   ├── config/          # Cấu hình môi trường
│   ├── controllers/     # Xử lý API request
│   ├── middlewares/     # Bảo mật (JWT), Validation
│   ├── models/          # Schema Database (Prisma)
│   ├── routes/          # Định nghĩa endpoint
│   ├── services/        # Business logic
│   └── app.js           # Entry point
├── tests/               # Unit tests
├── scripts/             # Database seeding
└── serverless.yml       # Cấu hình triển khai AWS
```
## 3. Hướng dẫn cài đặt (Local Development)

### Bước 1: Cài đặt Dependencies
```text
npm install
```
### Bước 2: Thiết lập biến môi trường
Tạo file .env từ file .env.example:
```text
cp .env.example .env
```
Chỉnh sửa nội dung file .env với DATABASE_URL và các keys

### Bước 3: Chạy ứng dụng Local
Sử dụng serverless-offline để giả lập AWS trên máy tính:
```text
npm run dev
```
*API sẽ chạy tại: http://localhost:3000*

## 4. Triển khai (Deployment)
Để đẩy code lên AWS Lambda:
```text
serverless deploy
```

## 5. Tài liệu API
- Xem chi tiết tại: [specification](./docs/[EN]_api_spec.md) hoặc [đặc tả](./docs/[VI]_api_spec.md)
- Xem thiết kế database tại: [specification](./docs/[EN]_database_spec.md) hoặc [đặc tả](./docs/[VI]_database_spec.md)