# Thiết kế Database Schema: Thương mại điện tử Nước hoa

## 1. Dữ liệu Người dùng & Đơn hàng
- **Users**: Kho lưu trữ tập trung cho thông tin hồ sơ người dùng.
- **Orders**: Thông tin tổng quát đơn hàng bao gồm `total_amount`, `status` (Enum: pending, paid, shipping, completed, cancelled), và `shipping_address`.
- **Order_Items**: Bảng trung gian liên kết Orders với các Product_Variants cụ thể. Lưu ý: lưu trữ `price_at_purchase` dưới dạng snapshot để xử lý các thay đổi về giá trong tương lai.

## 2. Quản lý kho hàng
- **Products**: Thông tin cơ bản (tên, thương hiệu, mô tả, ảnh).
- **Product_Variants**: Quản lý đơn vị lưu kho (SKU) dựa trên dung tích (ví dụ: 30ml, 50ml, 100ml) và nồng độ (EDP, EDT).
- **Categories**: Phân loại sản phẩm để hỗ trợ việc lọc (Floral, Woody, Citrus, v.v.).

## 3. Cấu trúc Scent Pyramid (Tầng hương)
- **Notes**: Danh sách các thành phần hương chính (ví dụ: Bergamot, Rose).
- **Product_Notes_Map**: Bản đồ liên kết sản phẩm với các thành phần hương và xác định vị trí trong tầng hương (`layer_type`: top, heart, base).

## 4. Hướng dẫn Triển khai
- **ORM Recommendation**: Sử dụng ORM (Prisma cho Node.js, SQLAlchemy cho Python) để quản lý migration database và định nghĩa model.
- **Data Integrity**: Thiết lập ràng buộc `ON DELETE CASCADE` cho các mối quan hệ như Order_Items hoặc Product_Variants để tránh tình trạng dữ liệu mồ côi (orphaned records).
- **Testing**: Luôn duy trì file `seed.py` hoặc `seed.js` để tạo dữ liệu mẫu cho việc phát triển nhanh chóng.