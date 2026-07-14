# Phân tích bảo mật

## Các yêu cầu đã được đặc tả

* Sử dụng JWT để xác thực người dùng; middleware có nhiệm vụ kiểm tra và giải mã (decode) header `Authorization`.
* Bảo vệ các endpoint yêu cầu xác thực, bao gồm: đăng xuất (logout), giỏ hàng (cart), đơn hàng (order) và tạo đánh giá (review creation).
* Chỉ cho phép người dùng đã mua sản phẩm được tạo đánh giá (review).
* Lưu `DATABASE_URL`, `JWT_SECRET`, thông tin xác thực (credentials), API key và các cấu hình nhạy cảm khác trong biến môi trường (environment variables); tuyệt đối không commit file `.env` lên hệ thống quản lý mã nguồn.
* Amazon Cognito được khuyến nghị để xây dựng hệ thống xác thực có khả năng mở rộng và bảo mật cao, nhưng không phải là thành phần bắt buộc.
* Middleware là nơi được phép triển khai các chức năng xác thực (authentication), phân quyền (authorization), kiểm tra dữ liệu đầu vào (validation), ghi log (logging) và xử lý lỗi (error handling).

## Các yêu cầu cần được thực thi

Quá trình xác thực phải thiết lập chính xác danh tính của người dùng hiện tại. Các tầng Service phải sử dụng danh tính này để giới hạn (scope) các thao tác đọc/ghi đối với giỏ hàng và đơn hàng, đồng thời xác minh điều kiện đã mua sản phẩm trước khi cho phép tạo đánh giá. Điều này nhằm ngăn chặn các lỗ hổng **Insecure Direct Object Reference (IDOR)**.

Cơ chế xử lý lỗi phải luôn trả về đúng định dạng phản hồi lỗi (error response envelope) đã được quy định, đồng thời không được làm lộ các thông tin nhạy cảm như:

* Secret
* Stack trace
* JWT hoặc các loại token
* Credentials
* Thông tin chi tiết của cơ sở dữ liệu

Hệ thống ghi log cũng phải tránh lưu trữ thông tin xác thực và dữ liệu cá nhân nhạy cảm của người dùng.

## Các nội dung còn thiếu cần được quyết định

Các tài liệu đặc tả hiện tại vẫn chưa xác định các nội dung sau:

* Thuật toán ký JWT (JWT signing algorithm)
* Thời hạn của Access Token và Refresh Token
* Cơ chế rotation, lưu trữ và thu hồi (revocation) Refresh Token
* Chính sách băm mật khẩu và đặt lại mật khẩu
* Quy trình xác minh tài khoản khi đăng ký
* Hệ thống phân quyền (roles) và các chức năng quản trị
* Rate limiting
* Chính sách CORS
* Chính sách bắt buộc sử dụng HTTPS
* Security headers
* Chính sách lưu giữ log và audit
* Yêu cầu về mã hóa dữ liệu và quyền riêng tư
* Phạm vi quyền của AWS IAM
* Cơ chế kiểm soát tải tệp lên Amazon S3
* Quy trình xử lý thanh toán

Các nội dung còn thiếu này đã được tổng hợp trong tệp `questions.md`.
