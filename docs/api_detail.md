# API Specification: Perfume E-commerce System


**Cấu hình cơ bản (Base Configuration):**
```http
@baseUrl = http://localhost:3000
@token = <DÁN_TOKEN_VÀO_ĐÂY_SAU_KHI_LOGIN>
```

---

## 1. Authentication Module (4 APIs)

### 1.1. Đăng ký tài khoản (Register)
**Input:**
```http
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "BK"
}
```

**Outputs:**

#### 201 Created (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "id": "uuid", 
    "email": "user@example.com", 
    "name": "BK" 
  } 
}
```

#### 400 Bad Request (Error): 
```
{ 
  "status": "error", 
  "message": "Email already exists or invalid input" 
}
```

### 1.2. Đăng nhập (Login)
**Input:**
```http
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token" 
  } 
}
```
#### 401 Unauthorized (Error): 

```
{ 
  "status": "error", 
  "message": "Invalid credentials" 
}
```

### 1.3. Cấp lại Token (Refresh Token)
**Input:**
```http
POST {{baseUrl}}/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token_here"
}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "accessToken": "new_jwt_access_token" 
  } 
}
```

#### 401 Unauthorized (Error): 
``` 
{ 
  "status": "error", 
  "message": "Refresh token expired or invalid" 
}
```

### 1.4. Đăng xuất (Logout) 
**Input:**
```http
POST {{baseUrl}}/api/auth/logout
Authorization: Bearer {{token}}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "message": "Logged out successfully" 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Missing or invalid token" 
}
```
---

## 2. Product Management Module (4 APIs)

### 2.1. Lấy danh sách sản phẩm (Get Products)
**Input:**
```http
GET {{baseUrl}}/api/products?limit=10&offset=0&category=nam&min_price=500000
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": [{ 
    "id": "uuid", 
    "name": "Perfume A", 
    "price": 1000000 
  }] 
}
```

### 2.2. Xem chi tiết sản phẩm (Get Product Detail)
**Input:**
```http
GET {{baseUrl}}/api/products/uuid-cua-san-pham
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "id": "uuid", 
    "name": "Perfume A", 
    "notes": [...] 
  } 
}
```
#### 404 Not Found (Error): 
```
{ 
  "status": "error", 
  "message": "Product not found" 
}
```

### 2.3. Tìm kiếm sản phẩm (Search)
**Input:**
```http
GET {{baseUrl}}/api/search?q=chanel&limit=10&offset=0
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": [{ 
    "id": "uuid", 
    "name": "Chanel No 5" 
  }] 
}
```

### 2.4. Lấy danh sách danh mục (Get Categories)
**Input:**
```http
GET {{baseUrl}}/api/categories
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": [{ 
    "id": "uuid", 
    "name": "Hương gỗ" 
  }] 
}
```
---

## 3. Cart & Order Modules (7 APIs)

### 3.1. Xem giỏ hàng (Get Cart)
**Input:**
```http
GET {{baseUrl}}/api/cart
Authorization: Bearer {{token}}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "id": "cart_uuid", 
    "items": [...] 
  } 
}
```
#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

### 3.2. Thêm vào giỏ hàng (Add to Cart)
**Input:**
```http
POST {{baseUrl}}/api/cart
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "variant_id": "uuid-cua-variant-san-pham",
  "quantity": 2
}
```

**Outputs:**
#### 201 Created (Success): 
```
{ 
  "status": "success", 
  "data": {
    "cartItemId": "uuid", 
    "quantity": 2 
  } 
}
```

#### 400 Bad Request (Error): 
```
{ 
  "status": "error", 
  "message": "Quantity exceeds stock" 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

### 3.3. Cập nhật số lượng trong giỏ (Update Cart Item)
**Input:**
```http
PUT {{baseUrl}}/api/cart/uuid-cua-cart-item
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "quantity": 3
}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "cartItemId": "uuid", 
    "new_quantity": 3 
  } 
}
```

#### 400 Bad Request (Error): 
```
{ 
  "status": "error", 
  "message": "Invalid quantity" 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

#### 404 Not Found (Error): 
```
{ 
  "status": "error", 
  "message": "Item not found in cart" 
}
```

### 3.4. Xóa sản phẩm khỏi giỏ (Delete Cart Item)
**Input:**
```http
DELETE {{baseUrl}}/api/cart/uuid-cua-cart-item
Authorization: Bearer {{token}}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "message": "Item removed from cart" 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

#### 404 Not Found (Error): 
```
{ 
  "status": "error", 
  "message": "Item not found" 
}
```

### 3.5. Thanh toán / Tạo đơn hàng (Checkout)
**Input:**
```http
POST {{baseUrl}}/api/orders
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "shippingAddress": "Ho Chi Minh"
}
```

**Outputs:**
#### 201 Created (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "orderId": "uuid", 
    "status": "pending", 
    "totalAmount": 1500000 
  } 
}
```

#### 400 Bad Request (Error): 
```
{ 
  "status": "error", 
  "message": "Cart is empty or items out of stock" 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

### 3.6. Xem lịch sử đơn hàng (Get Orders)
**Input:**
```http
GET {{baseUrl}}/api/orders
Authorization: Bearer {{token}}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": [{ 
    "id": "uuid", 
    "status": "completed", 
    "createdAt": "..." 
  }] 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

### 3.7. Xem chi tiết đơn hàng (Get Order Detail)
**Input:**
```http
GET {{baseUrl}}/api/orders/uuid-cua-don-hang
Authorization: Bearer {{token}}
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "id": "uuid", 
    "items": [...], 
    "status": "shipping" 
  } 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

#### 404 Not Found (Error): 
```
{ 
  "status": "error", 
  "message": "Order not found" 
}
```

---

## 4. Reviews Module (2 APIs)

### 4.1. Viết đánh giá sản phẩm (Create Review)
**Input:**
```http
POST {{baseUrl}}/api/products/uuid-cua-san-pham/reviews
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "rating": 5,
  "comment": "Mùi hương rất bền và sang trọng!"
}
```

**Outputs:**
#### 201 Created (Success): 
```
{ 
  "status": "success", 
  "data": { 
    "reviewId": "uuid", 
    "rating": 5 
  } 
}
```

#### 400 Bad Request (Error): 
```
{ 
  "status": "error", 
  "message": "Only verified purchasers can review this product" 
}
```

#### 401 Unauthorized (Error): 
```
{ 
  "status": "error", 
  "message": "Unauthorized" 
}
```

### 4.2. Xem đánh giá sản phẩm (Get Reviews)
**Input:**
```http
GET {{baseUrl}}/api/products/uuid-cua-san-pham/reviews
```

**Outputs:**
#### 200 OK (Success): 
```
{ 
  "status": "success", 
  "data": [{ 
    "rating": 5, 
    "comment": "...", 
    "userName": "BK" 
  }] 
}
```

#### 404 Not Found (Error): 
```
{ 
  "status": "error", 
  "message": "Product not found" 
}
```



