# Phân tích thực thể

| Thực thể | Dữ liệu hoặc trách nhiệm bắt buộc |
| --- | --- |
| User | Bản ghi hồ sơ/tài khoản người dùng trung tâm; các trường hồ sơ và thông tin xác thực chính xác chưa được xác định. |
| Product | Bản ghi danh mục nước hoa với tên, thương hiệu, mô tả và ảnh. |
| ProductVariant | SKU có thể bán của một sản phẩm, xác định bởi dung tích (như 30ml/50ml/100ml) và nồng độ (như EDP/EDT); tồn kho và giá được ngụ ý bởi thanh toán và bản chụp giao dịch mua. |
| Category | Phân loại sản phẩm, ví dụ Floral, Woody hoặc Citrus. Bội số quan hệ chính xác chưa được xác định. |
| Note | Bản ghi thành phần hương thơm chính, ví dụ Bergamot hoặc Rose. |
| ProductNotesMap | Liên kết sản phẩm-với-nốt hương, mang tầng tháp hương: `top`, `heart` hoặc `base`. |
| Cart | Giỏ hàng tồn tại lâu dài thuộc người dùng hiện tại. API yêu cầu nhưng đặc tả cơ sở dữ liệu không có. |
| CartItem | Dòng giỏ hàng chứa biến thể sản phẩm và số lượng. API yêu cầu nhưng đặc tả cơ sở dữ liệu không có. |
| Order | Phần đầu đơn hàng gồm `total_amount`, `status` và `shipping_address`. Giá trị trạng thái: `pending`, `paid`, `shipping`, `completed`, `cancelled`. |
| OrderItem | Dòng đơn hàng nối đơn hàng với biến thể sản phẩm và lưu `price_at_purchase`. |
| Review | Điểm số/đánh giá sản phẩm do người mua đã xác minh tạo. API yêu cầu nhưng thiết kế trường chưa được xác định. |
| RefreshToken/Session | Biểu diễn phía máy chủ cần có để vô hiệu hóa phiên đăng xuất và refresh token; chưa được mô hình hóa rõ trong đặc tả cơ sở dữ liệu. |

Giá trị tiền tệ cuối cùng nên dùng kiểu decimal PostgreSQL/Prisma có độ chính xác cố định thay vì số dấu phẩy động; đây là khuyến nghị triển khai, không phải yêu cầu nguồn rõ ràng.
