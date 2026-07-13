# Tài liệu API: Hệ thống Thương mại điện tử Nước hoa

## 1. Module Authentication (Xác thực)
Quản lý quyền truy cập người dùng và phiên làm việc. Khuyến khích tích hợp với Amazon Cognito để đảm bảo tính bảo mật và khả năng mở rộng.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Đăng ký tài khoản người dùng mới | No |
| POST | `/api/auth/login` | Đăng nhập, trả về Access/Refresh Tokens | No |
| POST | `/api/auth/refresh` | Làm mới Access Token | No |
| POST | `/api/auth/logout` | Đăng xuất/Vô hiệu hóa phiên làm việc | Yes |

## 2. Module Product Management (Quản lý sản phẩm)
Module cốt lõi để khám phá và lọc sản phẩm. Được thiết kế tối ưu với các best practices về phân trang và bộ lọc.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/products` | Lấy danh sách sản phẩm. Query params: `category`, `scent`, `min_price`, `limit`, `offset` | No |
| GET | `/api/products/{id}` | Lấy thông tin chi tiết của một loại nước hoa (bao gồm các note hương) | No |
| GET | `/api/search` | Tìm kiếm theo tên (`?q=name`) | No |
| GET | `/api/categories` | Lấy danh sách nhóm mùi hương/thương hiệu | No |

## 3. Module Cart & Order (Giỏ hàng & Đơn hàng)
Đảm bảo dữ liệu người dùng được lưu trữ nhất quán giữa các thiết bị và xử lý quy trình thanh toán.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/cart` | Lấy giỏ hàng của người dùng hiện tại | Yes |
| POST | `/api/cart` | Thêm sản phẩm vào giỏ hàng (Body: `variant_id`, `quantity`) | Yes |
| PUT | `/api/cart/{itemId}` | Cập nhật số lượng sản phẩm trong giỏ hàng | Yes |
| DELETE | `/api/cart/{itemId}` | Xóa sản phẩm khỏi giỏ hàng | Yes |
| POST | `/api/orders` | Checkout: Chuyển giỏ hàng thành đơn hàng | Yes |
| GET | `/api/orders` | Xem lịch sử đơn hàng của người dùng | Yes |
| GET | `/api/orders/{id}` | Xem chi tiết hoặc trạng thái đơn hàng cụ thể | Yes |

## 4. Module Reviews (Đánh giá)
Hệ thống phản hồi từ người dùng. Chỉ áp dụng cho người dùng đã xác thực là người mua hàng.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/products/{id}/reviews` | Gửi đánh giá/xếp hạng sản phẩm | Yes |
| GET | `/api/products/{id}/reviews` | Lấy tất cả đánh giá của một sản phẩm | No |

---
## API Design Best Practices
*   **Response Structure:** Cấu trúc nhất quán cho tất cả các endpoint:
    *   *Thành công:* `{ "status": "success", "data": {...} }`
    *   *Thất bại:* `{ "status": "error", "message": "..." }`
*   **Standard Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).
*   **Pagination:** Luôn áp dụng `limit` và `offset` cho các endpoint danh sách để bảo vệ tài nguyên hệ thống.