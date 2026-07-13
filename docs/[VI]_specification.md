# Dự án: Hệ thống Thương mại điện tử Nước hoa
## Specification Documentation

Tài liệu này mô tả cấu trúc dự án và quy trình phát triển cho hệ thống backend của trang web bán nước hoa, đảm bảo tính chuyên nghiệp, dễ bảo trì và khả năng mở rộng.

---

## 1. Cấu trúc Thư mục (Project Structure)

Dự án áp dụng mô hình Layered Architecture (Kiến trúc phân tầng) để phân tách rõ ràng các phân vùng logic:

```text
BE/
├── src/
│   ├── config/          # Cấu hình môi trường (DB connection, Auth settings)
│   ├── controllers/     # Controller: Xử lý request API và trả về response
│   ├── middlewares/     # Middleware: Xác thực (JWT), Validation, Error handling
│   ├── models/          # Model: Định nghĩa Schema Database (Sử dụng ORM)
│   ├── routes/          # Route: Định nghĩa các endpoint API
│   ├── services/        # Service: Chứa business logic phức tạp
│   ├── utils/           # Utils: Các hàm hỗ trợ, constants
│   └── app.js           # Entry point: Điểm khởi chạy ứng dụng
├── tests/               # Unit tests cho các module API
├── scripts/             # Database seeding scripts (tạo dữ liệu mẫu)
├── .env                 # Biến môi trường (DB_URL, JWT_SECRET, v.v.)
├── package.json         # Quản lý dependencies
├── docs                 # Đặc tả api, database
└── README.md            # Tài liệu tổng quan dự án
```

---

## 2. Mô tả Chức năng Chi tiết từng Folder

### 2.1. src/config/
- Chức năng: Chứa toàn bộ các thiết lập cốt lõi của hệ thống.
- Ví dụ: Cấu hình kết nối cơ sở dữ liệu (PostgreSQL/MySQL), cấu hình bảo mật hoặc thiết lập tích hợp các dịch vụ từ bên thứ ba (như Amazon Cognito).

### 2.2. src/controllers/
- Chức năng: Đóng vai trò là lớp tiếp nhận yêu cầu (request) trực tiếp từ client.
- Nhiệm vụ: Trích xuất dữ liệu từ request (params, query, body), gọi tầng Service để thực hiện các tác vụ xử lý logic và trả về phản hồi HTTP tương ứng (200 OK, 201 Created, 400 Bad Request, v.v.) dưới định dạng JSON đồng nhất.

### 2.3. src/middlewares/
- Chức năng: Nơi chứa các hàm xử lý trung gian, thực hiện các logic bổ trợ bắt buộc trước khi yêu cầu được chuyển tiếp tới Controller.
- Các chức năng quan trọng bao gồm:
  - Kiểm tra và giải mã JWT Token trong Authorization Header.
  - Xác thực định dạng dữ liệu đầu vào (Input Validation).
  - Ghi nhật ký hệ thống (Logging request/response).

### 2.4. src/models/
- Chức năng: Định nghĩa cấu trúc dữ liệu và các bảng của dự án thông qua việc sử dụng ORM (như Prisma hoặc SQLAlchemy).
- Nhiệm vụ: Thiết lập các thực thể, mối quan hệ ràng buộc dữ liệu (ForeignKey, One-to-Many, Many-to-Many) và các điều kiện kiểm tra dữ liệu ở tầng DB.

### 2.5. src/routes/
- Chức năng: Định nghĩa toàn bộ các tuyến đường (lộ trình) của hệ thống API.
- Nhiệm vụ: Ánh xạ chính xác các endpoint (ví dụ: /api/products, /api/orders) tới các hàm xử lý tương ứng trong Controller, giúp phân tách các mô-đun một cách khoa học.

### 2.6. src/services/
- Chức năng: Trung tâm xử lý logic nghiệp vụ (Business Logic) thuần túy của toàn bộ ứng dụng.
- Ví dụ: Tính toán tổng giá trị đơn hàng thực tế, kiểm tra số lượng sản phẩm tồn kho (stock) trước khi tiến hành thanh toán, hoặc thực hiện các thuật toán phân loại và gợi ý mùi hương nâng cao.

---

## 3. Quy trình Phát triển & Tiêu chuẩn hệ thống (Best Practices)

Để hệ thống hoạt động ổn định và có hiệu năng cao, quá trình lập trình cần tuân thủ nghiêm ngặt các quy tắc sau:

- Data Integrity (Toàn vẹn Dữ liệu): Thiết lập ràng buộc ON DELETE CASCADE hợp lý cho các mối quan hệ phụ thuộc (ví dụ: từ Orders xuống Order_Items) nhằm triệt tiêu hoàn toàn tình trạng dữ liệu mồ côi (orphaned data) trong hệ thống.
- Consistency (Tính Nhất quán): Mọi response API khi trả về cho client đều phải được đóng gói theo một cấu trúc chuẩn hóa:
  - Khi thành công: { "status": "success", "data": {...} }
  - Khi thất bại: { "status": "error", "message": "Nội dung thông báo lỗi cụ thể" }
- Database Management (Quản trị Cơ sở Dữ liệu): Tuyệt đối không can thiệp chỉnh sửa cấu trúc bảng thủ công trực tiếp trên Database. Mọi thay đổi về schema bắt buộc phải được thực hiện thông qua các file Migration của ORM để đảm bảo tính đồng bộ giữa các môi trường phát triển.
- Environment Management (Quản lý Môi trường): Luôn tách biệt các cấu hình bảo mật thông tin nhạy cảm (như Database Credentials, API Keys, JWT Secret) vào tệp tin .env. Không bao giờ đẩy tệp tin này lên hệ thống kiểm soát phiên bản (Git).

## 4. Deployment & Environment
- **Cloud Infrastructure:** [Tên dịch vụ, ví dụ: Vercel, AWS, Render].
- **Database:** [Ví dụ: Managed PostgreSQL trên Supabase/Neon/RDS].
- **Environment Variables:** Danh sách các biến cần setup trên Cloud Dashboard:
  - `DATABASE_URL`: Đường dẫn kết nối DB.
  - `JWT_SECRET`: Khóa mã hóa.
  - `PORT`: Cổng chạy ứng dụng.