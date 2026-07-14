# Tóm tắt REST API

Mọi phản hồi đều dùng cấu trúc đã được ghi nhận: thành công `{ "status": "success", "data": ... }`; lỗi `{ "status": "error", "message": "..." }`. Các mã trạng thái cơ sở được liệt kê là 200, 201, 400, 401, 404 và 500. Schema request/response chính xác chưa được cung cấp.

| Phương thức | Endpoint | Xác thực | Mục đích / dữ liệu đầu vào đã nêu |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Không | Đăng ký người dùng. |
| POST | `/api/auth/login` | Không | Đăng nhập và trả về access/refresh token. |
| POST | `/api/auth/refresh` | Không | Làm mới access token. |
| POST | `/api/auth/logout` | Có | Đăng xuất và vô hiệu hóa phiên. |
| GET | `/api/products` | Không | Danh sách sản phẩm; `category`, `scent`, `min_price`, `limit`, `offset`. |
| GET | `/api/products/{id}` | Không | Chi tiết sản phẩm, bao gồm các nốt hương. |
| GET | `/api/search` | Không | Tìm theo tên bằng `q`. |
| GET | `/api/categories` | Không | Nhóm mùi hương/thương hiệu/danh mục. |
| GET | `/api/cart` | Có | Giỏ hàng của người dùng hiện tại. |
| POST | `/api/cart` | Có | Thêm `{ variant_id, quantity }`. |
| PUT | `/api/cart/{itemId}` | Có | Cập nhật số lượng một mục giỏ hàng; body chưa xác định. |
| DELETE | `/api/cart/{itemId}` | Có | Xóa một mục giỏ hàng. |
| POST | `/api/orders` | Có | Thanh toán và chuyển giỏ hàng thành đơn hàng; dữ liệu giao hàng chưa xác định. |
| GET | `/api/orders` | Có | Lịch sử đơn hàng của người dùng hiện tại. |
| GET | `/api/orders/{id}` | Có | Chi tiết/trạng thái đơn hàng của người dùng hiện tại. |
| POST | `/api/products/{id}/reviews` | Có | Tạo đánh giá của người đã mua được xác minh; body chưa xác định. |
| GET | `/api/products/{id}/reviews` | Không | Liệt kê đánh giá sản phẩm. |

Mọi endpoint trả về danh sách cần áp dụng `limit` và `offset`. Tài liệu đặc tả nêu rõ điều này cho danh sách sản phẩm và xem đó là thực hành tốt trên toàn API; giá trị mặc định và tối đa chính xác vẫn chưa được quyết định.
