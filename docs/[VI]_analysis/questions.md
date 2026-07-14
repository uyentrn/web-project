# Các câu hỏi mở và yêu cầu còn thiếu

## Phạm vi và nền tảng

1. Việc triển khai sẽ sử dụng JavaScript hay TypeScript? Stack được yêu cầu đề cập đến Node.js/Express, trong khi README lại ghi TypeScript và file khởi động là `app.js`.
2. Cần sử dụng nhà cung cấp PostgreSQL được quản lý (managed PostgreSQL) nào và cấu hình/dịch vụ AWS nào? Tài liệu có đề cập AWS Lambda/API Gateway/S3 nhưng hiện vẫn chưa có file `serverless.yml`.
3. Amazon Cognito là bắt buộc, tùy chọn hay không sử dụng, thay vào đó dùng JWT được phát hành cục bộ?
4. Tài liệu đặc tả có đề cập thư mục `src/utils/`; thư mục này có được phép tồn tại mặc dù không xuất hiện trong cấu trúc thư mục yêu cầu hay không?

## Tài khoản và phiên đăng nhập

5. Đăng ký/đăng nhập yêu cầu những trường nào, chính sách mật khẩu ra sao, sử dụng phương pháp băm mật khẩu nào, có cần xác thực email hay quy trình đặt lại mật khẩu hay không, và hệ thống xử lý tài khoản trùng lặp như thế nào?
6. JWT sẽ sử dụng thuật toán nào, issuer/audience nào, thời hạn của access token và refresh token là bao lâu, có áp dụng refresh token rotation hay không, token được lưu ở đâu, và cơ chế đăng xuất/thu hồi token hoạt động như thế nào?
7. Hệ thống có phân quyền người dùng (admin, customer) hay không, và có các API quản trị ngoài danh sách endpoint của giai đoạn này hay không?

## Danh mục sản phẩm và cơ sở dữ liệu

8. Mỗi thực thể bao gồm những trường dữ liệu nào, định danh (identifier), ràng buộc duy nhất (uniqueness constraints), timestamp, đơn vị tiền tệ và độ chính xác của kiểu Decimal ra sao?
9. Brand là một thuộc tính của Product, một Category hay là một thực thể riêng? Quan hệ giữa Product và Category là một-nhiều hay nhiều-nhiều?
10. Product Variant bao gồm những trường nào cho giá và tồn kho? Tổ hợp SKU, dung tích (size) và nồng độ (concentration) có bắt buộc phải duy nhất hay không?
11. Product và Product Variant sẽ bị xóa cứng (hard delete), xóa mềm (soft delete) hay lưu trữ (archive)? Quyết định này sẽ ảnh hưởng đến việc sử dụng cascade delete trong khi vẫn cần giữ lại lịch sử đơn hàng.
12. Cart, Cart Item, Review và Session/Refresh Token bao gồm những trường dữ liệu nào và có vòng đời (lifecycle) như thế nào?

## API và xác thực dữ liệu

13. Request và Response schema chính xác của từng endpoint là gì, bao gồm login/register, refresh/logout, địa chỉ giao hàng khi checkout, cập nhật giỏ hàng, review và các response lỗi?
14. Các quy tắc định dạng và giới hạn áp dụng cho ID, số lượng (quantity), giá (price), `q`, các bộ lọc (filters), `limit` và `offset` là gì? Giá trị mặc định và giá trị tối đa của phân trang là bao nhiêu?
15. Endpoint `/api/categories` sẽ trả về Categories, nhóm mùi hương (scent groups), Brands hay một hệ thống phân loại kết hợp? Bộ lọc `category` và `scent` sẽ được ánh xạ như thế nào?
16. Ngoài các mã trạng thái HTTP hiện có, hệ thống sẽ sử dụng những mã nào cho các trường hợp xung đột dữ liệu (conflict), lỗi phân quyền (authorization failure), lỗi xác thực dữ liệu (validation failure) và giới hạn tần suất (rate limiting)?

## Quy tắc nghiệp vụ thương mại điện tử

17. Tồn kho sẽ được giữ chỗ (reserve) hoặc trừ vào thời điểm nào? Hệ thống sẽ xử lý nhiều phiên checkout đồng thời (concurrent checkout) như thế nào để đảm bảo tính nguyên tử (atomicity)?
18. Điều gì xảy ra với giỏ hàng sau khi checkout thành công hoặc thất bại? Có cho phép checkout với giỏ hàng trống hay không?
19. Hệ thống yêu cầu những quy tắc nào về chuyển đổi trạng thái đơn hàng, hủy đơn/hoàn tiền, tích hợp thanh toán, thuế, phí vận chuyển, giảm giá và đơn vị tiền tệ?
20. Đơn hàng ở trạng thái nào được xem là đủ điều kiện để khách hàng đánh giá sản phẩm? Một khách hàng có được tạo hoặc chỉnh sửa nhiều hơn một review cho cùng một sản phẩm hay không? Có cần cơ chế kiểm duyệt review hay không?

## Bảo mật và vận hành

21. Hệ thống yêu cầu cấu hình nào cho CORS, giới hạn tần suất (rate limiting), HTTPS/security headers, logging/auditing, chính sách lưu giữ dữ liệu và quyền riêng tư, cũng như các thiết lập IAM/S3 trên AWS?
22. Mức độ bao phủ kiểm thử (test coverage) và chiến lược sử dụng cơ sở dữ liệu cho Jest/Supertest được yêu cầu như thế nào?
