# Quy tắc kiểm tra dữ liệu (Validation Rules)

## Các yêu cầu được đặc tả rõ ràng

* Toàn bộ dữ liệu đầu vào của các endpoint phải được kiểm tra (validate) thông qua middleware trước khi Controller gọi đến tầng Service.
* API lấy danh sách sản phẩm (Product Listing) chấp nhận các tham số:

  * `category`
  * `scent`
  * `min_price`
  * `limit`
  * `offset`
* API tìm kiếm sản phẩm yêu cầu tham số truy vấn `q` để tìm kiếm theo tên sản phẩm.
* API thêm sản phẩm vào giỏ hàng (Add to Cart) yêu cầu hai trường:

  * `variant_id`
  * `quantity`
* API cập nhật giỏ hàng (Cart Update) sử dụng tham số đường dẫn (path parameter) `itemId` để xác định Cart Item và phải nhận giá trị số lượng (quantity). Tuy nhiên, tên chính xác của trường trong request body vẫn chưa được quy định.
* Các endpoint về Product và Review sử dụng tham số đường dẫn `id` của Product.
* Các endpoint về Cart sử dụng tham số đường dẫn `itemId`.
* Endpoint lấy chi tiết đơn hàng (Order Detail) sử dụng tham số đường dẫn `id` của Order.
* Cơ chế phân trang sử dụng `limit` và `offset`; các giá trị này phải được kiểm tra và giới hạn nhằm bảo vệ tài nguyên hệ thống.
* Khi gửi một Review, ngoài việc vượt qua kiểm tra dữ liệu đầu vào thông thường, người dùng còn phải vượt qua bước kiểm tra phân quyền để xác minh rằng họ thực sự đã mua sản phẩm (verified purchaser).

## Các nội dung cần được đặc tả trước khi triển khai

Các tài liệu đặc tả hiện tại vẫn chưa xác định các quy tắc sau:

* Định dạng của các định danh (ID format)
* Các trường bắt buộc cho đăng ký và đăng nhập
* Chính sách mật khẩu
* Giới hạn giá trị của các trường số (numeric ranges)
* Giới hạn của `quantity`
* Giá trị mặc định và giá trị tối đa của `limit` và `offset`
* Độ dài tối thiểu và tối đa của chuỗi tìm kiếm (`q`)
* Đơn vị tiền tệ và độ chính xác của trường giá (price scale/currency)
* Định dạng hợp lệ của `category` và `scent`
* Schema của địa chỉ giao hàng (shipping address)
* Schema của Review và Rating
* Quy tắc kiểm tra các giá trị Enum trong các thao tác ghi dữ liệu (create/update)

Các nội dung còn thiếu này đã được tổng hợp trong tệp `questions.md` và cần được xác định trước khi xây dựng mã nguồn cho tầng Validation.
