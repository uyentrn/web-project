# Tài liệu API: Hệ thống Thương mại điện tử Nước hoa

## 1. Module Authentication (Xác thực)
Quản lý quyền truy cập người dùng và phiên làm việc. Khuyến khích tích hợp với Amazon Cognito để đảm bảo tính bảo mật và khả năng mở rộng.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Đăng ký tài khoản người dùng mới | No |
| POST | `/api/auth/login` | Đăng nhập, trả về Access/Refresh Tokens | No |
| POST | `/api/auth/refresh` | Làm mới Access Token | No |
| POST | `/api/auth/logout` | Đăng xuất/Vô hiệu hóa phiên làm việc | Yes |
| GET  | `/api/me` | Lấy thông tin của người dùng hiện tại | Yes|
| PATCH | `/api/me` | Sửa thông tin | Yes |

## 2. Module Product Management (Quản lý sản phẩm)
Module cốt lõi để khám phá và lọc sản phẩm. Được thiết kế tối ưu với các best practices về phân trang và bộ lọc.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/products` | Lấy danh sách sản phẩm. Query params: `category`, `brand`, `scent`, `min_price`, `limit`, `offset` | No |
| GET | `/api/products/{id}` | Lấy thông tin chi tiết của một loại nước hoa (bao gồm các note hương) | No |
| POST | `/api/products` | Tạo một sản phẩm mới | Yes (Admin) |
| PUT | `/api/products/{id}` | Thay đổi thông tin của một sản phẩm | Yes (Admin) |
| DELETE | `/api/products/{id}` | Xóa một sản phẩm | Yes (Admin) | 
| GET | `/api/search` | Tìm kiếm theo tên (`?q=name`) | No |
| GET | `/api/brand/{id}` | Lấy danh sách sản phầm thuộc một brand cụ thể | No | 
| GET | `/api/categories` | Lấy danh sách nhóm mùi hương/thương hiệu | No |
| POST | `/api/categories` | Tạo một nhóm mùi/ thương hiệu mới | Yes (Admin) |
| PUT | `/api/categories/{id}` | Sửa thông tin của một nhóm mùi hương/ thương hiệu cụ thể | Yes (Admin) |
| DELETE | `/api/categories/{id}` | Xóa một nhóm mùi hương / thương hiệu cụ thể | Yes (Admin) |  

## 3. Module Cart & Order (Giỏ hàng & Đơn hàng)
Đảm bảo dữ liệu người dùng được lưu trữ nhất quán giữa các thiết bị và xử lý quy trình thanh toán.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/cart` | Lấy giỏ hàng của người dùng hiện tại | Yes (Client) |
| POST | `/api/cart` | Thêm sản phẩm vào giỏ hàng (Body: `variant_id`, `quantity`) | Yes (Client) |
| PUT | `/api/cart/{itemId}` | Cập nhật số lượng sản phẩm trong giỏ hàng | Yes (Client) |
| DELETE | `/api/cart/{itemId}` | Xóa sản phẩm khỏi giỏ hàng | Yes (Client) |
| POST | `/api/orders` | Checkout: Chuyển giỏ hàng thành đơn hàng | Yes (Client) |
| GET | `/api/orders` | Xem lịch sử đơn hàng của người dùng | Yes (Client) |
| GET | `/api/orders/{id}` | Xem chi tiết hoặc trạng thái đơn hàng cụ thể | Yes (Client) |
| GET |`/api/admin/orders`| Xem lịch sử đơn hàng của tất cả người dùng | Yes (Admin) |
| GET | `/api/admin/orders/:id` | Xem chi tiết hoặc trạng thái đơn hàng cụ thể | Yes (Admin) |
| POST | `/api/payments` |  | Yes (Client) |
| GET | `/api/payments/{id}` |  | Yes (Client) |

## 4. Module Reviews (Đánh giá)
Hệ thống phản hồi từ người dùng. Chỉ áp dụng cho người dùng đã xác thực là người mua hàng.

| Method | Endpoint | Mô tả | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/products/{id}/reviews` | Gửi đánh giá/xếp hạng sản phẩm | Yes (Client) |
| GET | `/api/products/{id}/reviews` | Lấy tất cả đánh giá của một sản phẩm | No |
| PUT | `/api/reviews/{id}` | Cập nhật review đã tạo | Yes (Client) |
| DELETE | `/api/reviews/{id}` | Xóa một review đã tạo | Yes (Client) |
| DELETE | `/api/admin/reviews/{id}` | Xóa một review cụ thể | Yes (Admin) | 

---
## API Design
*   **Response Structure:** Cấu trúc nhất quán cho tất cả các endpoint:
    *   *Thành công:* `{ "status": "success", "data": {...} }`
    *   *Thất bại:* `{ "status": "error", "message": "..." }`
*   **Standard Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).
*   **Pagination:** Luôn áp dụng `limit` và `offset` cho các endpoint danh sách để bảo vệ tài nguyên hệ thống.