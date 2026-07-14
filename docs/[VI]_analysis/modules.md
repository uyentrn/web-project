# Phân tích mô-đun

## Xác thực

Hỗ trợ đăng ký, đăng nhập, làm mới access token và đăng xuất. Đăng nhập trả về access và refresh token; đăng xuất vô hiệu hóa một phiên. JWT là yêu cầu trong stack đã nêu, còn Amazon Cognito được khuyến nghị nhưng không bắt buộc.

## Danh mục sản phẩm

Cung cấp liệt kê sản phẩm có phân trang, chi tiết sản phẩm bao gồm nốt hương, tìm kiếm theo tên và khám phá danh mục/thương hiệu. Sản phẩm có các biến thể cho tổ hợp dung tích/nồng độ có thể mua. Bộ lọc được nêu cho danh mục, mùi hương và giá tối thiểu.

## Giỏ hàng

Cung cấp giỏ hàng bền vững của người dùng đã xác thực trên nhiều thiết bị. Mục giỏ hàng chọn một biến thể sản phẩm và số lượng. API hỗ trợ lấy, thêm, cập nhật số lượng và xóa.

## Đơn hàng

Thanh toán chuyển giỏ hàng của người dùng đã xác thực thành đơn hàng. Phải tính tổng, xác thực tồn kho khi thanh toán, lưu bản chụp giá mua cho từng mục đơn hàng và cung cấp lịch sử đơn hàng cũng như chi tiết/trạng thái từng đơn hàng của người dùng.

## Đánh giá

Cho phép công khai lấy đánh giá sản phẩm. Việc tạo đánh giá yêu cầu xác thực và đã mua sản phẩm liên quan. Các trường điểm số/đánh giá, chính sách duy nhất và kiểm duyệt chưa được xác định.

## Mô-đun hỗ trợ

Cấu hình quản lý thiết lập cơ sở dữ liệu, token và đám mây. Middleware bao quát xác thực, phân quyền, validation, ghi log request/response và xử lý lỗi. Kiểm thử nên dùng Jest và Supertest. Script seed dữ liệu mẫu cho cơ sở dữ liệu.
