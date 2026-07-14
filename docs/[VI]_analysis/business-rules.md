# Quy tắc nghiệp vụ

1. Xác thực tạo thông tin xác thực access và refresh; access phải có thể làm mới và đăng xuất phải vô hiệu hóa phiên tương ứng.
2. Thao tác giỏ hàng được giới hạn cho người dùng đã xác thực; người gọi không bao giờ được truy cập giỏ hàng hoặc mục giỏ hàng của người khác.
3. Các dòng giỏ hàng chọn biến thể sản phẩm và mang số lượng.
4. Thanh toán chuyển giỏ hàng của người dùng thành đơn hàng, tính tổng đơn hàng và kiểm tra tồn kho hiện tại trước khi hoàn tất chuyển đổi.
5. Đơn hàng ghi `total_amount`, địa chỉ giao hàng và một trong các trạng thái: `pending`, `paid`, `shipping`, `completed`, `cancelled`.
6. Mỗi mục đơn hàng chụp lại `price_at_purchase`, bảo vệ tổng lịch sử trước các thay đổi giá sản phẩm về sau.
7. Chi tiết sản phẩm gồm các nốt hương và vị trí trong tháp hương: top, heart hoặc base.
8. Khám phá sản phẩm hỗ trợ bộ lọc danh mục, mùi hương, giá tối thiểu và tìm kiếm theo tên.
9. Chỉ người mua sản phẩm đã được xác minh và đã xác thực mới được gửi đánh giá; bất kỳ ai cũng có thể lấy đánh giá.
10. Dữ liệu phụ thuộc không được trở thành mồ côi; hành vi xóa phải tuân thủ yêu cầu cascade đã ghi nhận và bảo toàn lịch sử đơn hàng.

Quy tắc về thay đổi giá, thời điểm giữ/giảm tồn kho, chuyển đổi trạng thái đơn hàng, hủy/hoàn tiền, đánh giá trùng lặp và vòng đời tài khoản chưa được đặc tả; cần được giải quyết trước khi triển khai.
