# Phân tích mối quan hệ giữa các thực thể

## Các mối quan hệ được đặc tả rõ ràng

```text
User 1 --- * Order 1 --- * OrderItem * --- 1 ProductVariant * --- 1 Product
Product * --- * Note (thông qua ProductNotesMap, có thuộc tính layer_type)
```

* Mỗi OrderItem tham chiếu đến một ProductVariant và lưu lại giá sản phẩm tại thời điểm mua (`price_at_purchase`).
* Mỗi ProductVariant thuộc về một Product.
* Quan hệ giữa Product và Note là nhiều-nhiều (many-to-many), trong đó bảng liên kết lưu thêm thông tin `top`, `heart` hoặc `base` để xác định tầng hương.
* Tài liệu yêu cầu sử dụng **cascade delete** đối với các bản ghi phụ thuộc như OrderItem và ProductVariant, tuy nhiên chưa chỉ rõ hướng của các khóa ngoại (foreign keys) hoặc chính sách lưu giữ dữ liệu (retention policy).

## Các mối quan hệ được suy ra từ API

```text
User 1 --- 1 Cart 1 --- * CartItem * --- 1 ProductVariant
User 1 --- * Review * --- 1 Product
Product * --- ? Category
User 1 --- * RefreshToken/Session
```

* Mỗi người dùng cần có một giỏ hàng (Cart) hiện tại được lưu trữ lâu dài; tuy nhiên vòng đời của Cart và việc có tạo sẵn một Cart rỗng ngay sau khi người dùng đăng ký hay không vẫn chưa được xác định.
* CartItem tham chiếu đến ProductVariant đã được chọn thay vì chỉ tham chiếu trực tiếp đến Product.
* Mỗi Review thuộc về một User và một Product. Việc phân quyền để người dùng được phép đánh giá sản phẩm yêu cầu phải có bằng chứng rằng họ đã mua sản phẩm đó, tuy nhiên tài liệu chưa xác định trạng thái đơn hàng nào được xem là đủ điều kiện.
* API mô tả Categories như các nhóm mùi hương (scent groups) hoặc thương hiệu (brands), trong khi đặc tả cơ sở dữ liệu lại mô tả Categories là danh mục sản phẩm. Hiện vẫn chưa rõ Brand là một Category hay là một thực thể độc lập.

## Các vấn đề về toàn vẹn dữ liệu và vòng đời

Sử dụng khóa ngoại (foreign keys) và Prisma Migrate để đảm bảo tính toàn vẹn dữ liệu. Trường `OrderItem.price_at_purchase` phải được giữ nguyên (immutable) sau khi đơn hàng được tạo, ngay cả khi giá của ProductVariant thay đổi sau này.

Nếu ProductVariant bị xóa và áp dụng **cascade delete** xuống các OrderItem trong lịch sử, toàn bộ lịch sử mua hàng sẽ bị mất. Do đó, yêu cầu chung về **cascade delete** đang mâu thuẫn với yêu cầu phải bảo toàn dữ liệu đơn hàng trong quá khứ. Trước khi triển khai, cần xác định rõ chính sách lưu giữ sản phẩm (product retention policy), chẳng hạn như **hard delete**, **soft delete** hoặc **archive**, để giải quyết mâu thuẫn này.
