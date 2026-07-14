# Thiết kế Database Schema: Thương mại điện tử Nước hoa

## 1. Tổng quan

Hệ thống sử dụng **PostgreSQL** kết hợp với **Prisma ORM**.

Các thực thể chính bao gồm:

- Users
- Categories
- Products
- Product_Variants
- Notes
- Product_Notes
- Carts
- Cart_Items
- Orders
- Order_Items
- Reviews
- Sessions

## 2. Enum

### 2.1. OrderStatus (Trạng thái đơn hàng)
| Giá trị | Ý nghĩa |
|----------|----------|
| pending | Chờ thanh toán |
| paid | Đã thanh toán |
| shipping | Đang giao |
| completed | Hoàn thành |
| cancelled | Đã hủy |

### 2.2. ScentLayer (Tầng hương của nước hoa)

| Giá trị | Ý nghĩa |
|----------|----------|
| top | Hương đầu |
| heart | Hương giữa |
| base | Hương cuối |


## 3. Database Schema

### 3.1. Users (Lưu trữ thông tin người dùng)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| email | String | Email, duy nhất |
| passwordHash | String | Mật khẩu đã mã hóa |
| name | String? | Tên người dùng |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ với các thực thể khác:**
- Một User có **một Cart**
- Một User có **nhiều Orders**
- Một User có **nhiều Reviews**
- Một User có **nhiều Sessions**

### 3.2. Categories (Phân loại sản phẩm)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| name | String | Tên danh mục, duy nhất |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ:**

- Một Category có nhiều Products.
### 3.3. Products (Thông tin cơ bản của sản phẩm)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| name | String | Tên sản phẩm |
| brand | String | Thương hiệu |
| description | Text | Mô tả sản phẩm |
| imageUrl | String | Ảnh đại diện |
| categoryId | UUID | Khóa ngoại đến Categories |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ**

- Thuộc một Category.
- Có nhiều Product_Variants.
- Có nhiều Product_Notes.
- Có nhiều Reviews.


### 3.4. Product_Variants (Quản lý từng phiên bản sản phẩm)

Ví dụ:

- Dior Sauvage EDP 60ml
- Dior Sauvage EDP 100ml
- Dior Sauvage EDT 100ml

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| productId | UUID | Khóa ngoại đến Products |
| sku | String | SKU duy nhất |
| sizeMl | Int | Dung tích |
| concentration | String | EDT, EDP, Parfum,... |
| price | Decimal(12,2) | Giá bán |
| stock | Int | Số lượng tồn kho |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ**

- Thuộc một Product.
- Có nhiều Cart_Items.
- Có nhiều Order_Items.

### 3.5. Notes (Danh sách các thành phần hương)

Ví dụ:

- Bergamot
- Rose
- Vanilla
- Musk

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| name | String | Tên nốt hương, duy nhất |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ:**

- Có nhiều Product_Notes.


### 3.6. Product_Notes (Bảng trung gian liên kết Product và Note)

Đồng thời xác định vị trí trong tầng hương.

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| productId | UUID | Khóa ngoại đến Products |
| noteId | UUID | Khóa ngoại đến Notes |
| layerType | ScentLayer | top / heart / base |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Khóa chính:**

- Composite Key (`productId`, `noteId`)

### 3.7. Carts (Giỏ hàng của người dùng)
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| userId | UUID | Khóa ngoại đến Users (duy nhất) |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ:**

- Thuộc một User.
- Có nhiều Cart_Items.

### 3.8. Cart_Items (Danh sách sản phẩm trong giỏ hàng)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| cartId | UUID | Khóa ngoại đến Carts |
| variantId | UUID | Khóa ngoại đến Product_Variants |
| quantity | Int | Số lượng |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Ràng buộc:**

- Composite Unique (`cartId`, `variantId`)

### 3.9. Orders (Thông tin tổng quát của đơn hàng)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| userId | UUID | Khóa ngoại đến Users |
| totalAmount | Decimal(12,2) | Tổng tiền |
| status | OrderStatus | Trạng thái đơn hàng |
| shippingAddress | Text | Địa chỉ giao hàng |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ:**

- Thuộc một User.
- Có nhiều Order_Items.

### 3.10. Order_Items (Danh sách sản phẩm trong đơn hàng)

Lưu `priceAtPurchase` để giữ nguyên giá tại thời điểm mua.

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| orderId | UUID | Khóa ngoại đến Orders |
| variantId | UUID | Khóa ngoại đến Product_Variants |
| quantity | Int | Số lượng |
| priceAtPurchase | Decimal(12,2) | Giá tại thời điểm mua |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Ràng buộc:**

- Composite Unique (`orderId`, `variantId`)

### 3.11. Reviews (Đánh giá sản phẩm)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| userId | UUID | Khóa ngoại đến Users |
| productId | UUID | Khóa ngoại đến Products |
| rating | Int | Điểm đánh giá |
| comment | Text? | Nội dung đánh giá |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ:**

- Thuộc một User.
- Thuộc một Product.

### 3.12. Sessions (Quản lý phiên đăng nhập)

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|-------------|------|
| id | UUID | Khóa chính |
| userId | UUID | Khóa ngoại đến Users |
| tokenHash | String | Refresh Token đã băm |
| expiresAt | DateTime | Thời gian hết hạn |
| revokedAt | DateTime? | Thời điểm thu hồi phiên |
| createdAt | DateTime | Thời gian tạo |
| updatedAt | DateTime | Thời gian cập nhật |

**Quan hệ:**

- Thuộc một User.

## 4. Quan hệ giữa các bảng

- User (1) —— (1) Cart
- User (1) —— (N) Order
- User (1) —— (N) Review
- User (1) —— (N) Session
- Category (1) —— (N) Product
- Product (1) —— (N) Product_Variant
- Product (1) —— (N) Product_Note
- Note (1) —— (N) Product_Note
- Cart (1) —— (N) Cart_Item
- Product_Variant (1) —— (N) Cart_Item
- Order (1) —— (N) Order_Item
- Product_Variant (1) —— (N) Order_Item
- Product (1) —— (N) Review

## 5. Ràng buộc dữ liệu

### 5.1. Unique Constraints

- Users.email
- Categories.name
- Product_Variants.sku
- Notes.name
- Sessions.tokenHash
- Carts.userId
- Product_Variants (`productId`, `sizeMl`, `concentration`)
- Cart_Items (`cartId`, `variantId`)
- Order_Items (`orderId`, `variantId`)

### 5.2. Primary Keys

- Mọi bảng đều sử dụng UUID làm khóa chính.
- Product_Notes sử dụng khóa chính tổng hợp (`productId`, `noteId`).

### 5.3. Indexes

#### a. Users

- createdAt

#### b. Products

- name
- brand
- categoryId

#### c. Product_Variants

- productId
- price

#### d. Product_Notes

- noteId
- layerType

#### e. Cart_Items

- variantId

#### f. Orders

- (`userId`, `createdAt`)
- status

#### g. Order_Items

- variantId

#### h. Reviews

- (`productId`, `createdAt`)
- userId

#### i. Sessions

- userId
- expiresAt

## 6. Chính sách ON DELETE

| Quan hệ | Chính sách |
|----------|------------|
| User → Cart | CASCADE |
| User → Review | CASCADE |
| User → Session | CASCADE |
| Category → Product | RESTRICT |
| Product → Product_Variant | CASCADE |
| Product → Product_Note | CASCADE |
| Product → Review | CASCADE |
| Note → Product_Note | CASCADE |
| Cart → Cart_Item | CASCADE |
| Product_Variant → Cart_Item | CASCADE |
| User → Order | RESTRICT |
| Order → Order_Item | CASCADE |
| Product_Variant → Order_Item | RESTRICT |


## 7. Hướng dẫn triển khai

- Sử dụng **Prisma ORM** để quản lý schema và migration.
- Sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu.
- Thực hiện migration thông qua Prisma Migrate.
- Duy trì file `seed.ts` hoặc `seed.js` để sinh dữ liệu mẫu phục vụ phát triển và kiểm thử.
- Luôn lưu giá sản phẩm tại thời điểm mua (`priceAtPurchase`) trong Order_Items nhằm đảm bảo tính toàn vẹn dữ liệu khi giá sản phẩm thay đổi.
- Sử dụng UUID làm khóa chính cho toàn bộ các bảng nhằm đảm bảo khả năng mở rộng và đồng bộ dữ liệu giữa các hệ thống.
