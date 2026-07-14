# Phân tích kiến trúc

## Mục đích hệ thống

Repository đặc tả backend cho ứng dụng thương mại điện tử nước hoa. Hệ thống cung cấp REST API cho phiên tài khoản, khám phá sản phẩm, giỏ hàng, đặt hàng và đánh giá sản phẩm. Môi trường chạy mục tiêu là Node.js trên hạ tầng serverless AWS, dùng PostgreSQL và Prisma.

## Kiến trúc bắt buộc

Phong cách bắt buộc là kiến trúc phân lớp. Mỗi request cần đi qua API Gateway/Lambda và Express, sau đó lần lượt qua route, middleware áp dụng, controller, service, Prisma model/cơ sở dữ liệu, rồi quay lại xử lý lỗi tập trung. Controller chỉ điều phối; service chịu trách nhiệm cho mọi quyết định nghiệp vụ và luồng giao dịch. Route chỉ chứa cấu hình endpoint. Schema Prisma và định nghĩa quan hệ cơ sở dữ liệu thuộc `src/models/`.

```text
Client -> API Gateway -> Lambda/Express app -> Route -> Middleware -> Controller
       -> Service -> Prisma -> PostgreSQL
                                      |
                                   response
```

## Vị trí trong repository

| Vị trí | Trách nhiệm dự kiến |
| --- | --- |
| `src/config/` | Cấu hình môi trường, Prisma, JWT và AWS |
| `src/controllers/` | Trích xuất dữ liệu HTTP, gọi service, gửi phản hồi chuẩn hóa |
| `src/middlewares/` | Xác thực JWT, phân quyền, validation, logging và lỗi |
| `src/models/` | Chỉ schema Prisma và định nghĩa mô hình dữ liệu |
| `src/routes/` | Chỉ ánh xạ endpoint tới controller |
| `src/services/` | Logic miền, thao tác lưu trữ, kiểm tra tồn kho, giao dịch |
| `src/app.js` | Điểm vào ứng dụng Express |
| `tests/` | Kiểm thử Jest/Supertest |
| `scripts/` | Chỉ seed dữ liệu cơ sở dữ liệu |
| `serverless.yml` | Cấu hình triển khai AWS |

Đặc tả cũng đề cập `src/utils/`, nhưng cấu trúc bắt buộc do người dùng cung cấp không có thư mục này. Không thêm hoặc phụ thuộc vào nó nếu chưa được phê duyệt sau này.

## Hành vi xuyên suốt

Mọi API phải trả về cấu trúc đã ghi nhận: kết quả thành công dùng `{ "status": "success", "data": ... }`; thất bại dùng `{ "status": "error", "message": "..." }`. Tài nguyên danh sách cần phân trang `limit`/`offset` có giới hạn. Mọi thay đổi cơ sở dữ liệu phải là migration Prisma, tuyệt đối không chỉnh sửa schema thủ công.

## Yêu cầu runtime và triển khai

Tài liệu xác định AWS Lambda, API Gateway, S3, Serverless Framework, Prisma và PostgreSQL được quản lý (Supabase, Neon hoặc RDS là các nhà cung cấp có thể dùng). Tài liệu cũng nêu `DATABASE_URL`, `JWT_SECRET` và `PORT`; thông tin xác thực và khóa phải nằm trong cấu hình môi trường, không được đưa vào kiểm soát phiên bản. Lựa chọn AWS/cơ sở dữ liệu chính xác và chiến lược kết nối Prisma trong Lambda vẫn chưa được nêu rõ.

## Trạng thái repository hiện tại

Chưa có mã triển khai ứng dụng: `package.json` và `src/app.js` trống, còn các thư mục nguồn được liệt kê không chứa tệp. Giai đoạn này chỉ thêm tài liệu phân tích.
