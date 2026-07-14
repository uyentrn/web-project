# Database Schema Design: Perfume E-commerce System

## 1. Overview

The system uses **PostgreSQL** as the relational database management system and **Prisma ORM** for schema definition and database migrations.

The main entities include:

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

## 2. Enums

### 2.1. OrderStatus

Represents the current status of an order.

| Value | Description |
|--------|-------------|
| pending | Waiting for payment |
| paid | Payment completed |
| shipping | Being shipped |
| completed | Successfully delivered |
| cancelled | Cancelled |

### 2.2. ScentLayer

Represents the position of a fragrance note within the scent pyramid.

| Value | Description |
|--------|-------------|
| top | Top note |
| heart | Heart (middle) note |
| base | Base note |


## 3. Database Schema

### 3.1. Users

Stores user account information.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| email | String | Unique email address |
| passwordHash | String | Hashed password |
| name | String? | User's display name |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- One User has **one Cart**.
- One User has **many Orders**.
- One User has **many Reviews**.
- One User has **many Sessions**.


### 3.2. Categories

Represents product categories.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| name | String | Unique category name |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- One Category has many Products.


### 3.3. Products

Stores general product information.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| name | String | Product name |
| brand | String | Brand name |
| description | Text | Product description |
| imageUrl | String | Product image URL |
| categoryId | UUID | Foreign key to Categories |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- Belongs to one Category.
- Has many Product_Variants.
- Has many Product_Notes.
- Has many Reviews.


### 3.4. Product_Variants

Represents purchasable product variants.

Examples:

- Dior Sauvage EDP 60ml
- Dior Sauvage EDP 100ml
- Dior Sauvage EDT 100ml

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| productId | UUID | Foreign key to Products |
| sku | String | Unique Stock Keeping Unit |
| sizeMl | Int | Bottle size (mL) |
| concentration | String | EDT, EDP, Parfum, etc. |
| price | Decimal(12,2) | Selling price |
| stock | Int | Available inventory |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- Belongs to one Product.
- Has many Cart_Items.
- Has many Order_Items.



### 3.5. Notes

Stores fragrance notes.

Examples:

- Bergamot
- Rose
- Vanilla
- Musk

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| name | String | Unique note name |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- Has many Product_Notes.


### 3.6. Product_Notes

Junction table linking Products and Notes.

Also specifies the note's position within the fragrance pyramid.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| productId | UUID | Foreign key to Products |
| noteId | UUID | Foreign key to Notes |
| layerType | ScentLayer | Top, Heart, or Base note |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Primary Key**

- Composite Key (`productId`, `noteId`)


### 3.7. Carts

Represents a user's shopping cart.

Each User owns exactly one Cart.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| userId | UUID | Unique foreign key to Users |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- Belongs to one User.
- Has many Cart_Items.


### 3.8. Cart_Items

Stores products added to a shopping cart.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| cartId | UUID | Foreign key to Carts |
| variantId | UUID | Foreign key to Product_Variants |
| quantity | Int | Quantity |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Constraints**

- Composite Unique (`cartId`, `variantId`)


### 3.9. Orders

Stores general order information.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to Users |
| totalAmount | Decimal(12,2) | Total order amount |
| status | OrderStatus | Current order status |
| shippingAddress | Text | Shipping address |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- Belongs to one User.
- Has many Order_Items.


### 3.10. Order_Items

Stores purchased products within an order.

The `priceAtPurchase` field preserves the product price at the time of purchase.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| orderId | UUID | Foreign key to Orders |
| variantId | UUID | Foreign key to Product_Variants |
| quantity | Int | Quantity purchased |
| priceAtPurchase | Decimal(12,2) | Product price at purchase time |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Constraints**

- Composite Unique (`orderId`, `variantId`)


### 3.11. Reviews

Stores customer reviews for products.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to Users |
| productId | UUID | Foreign key to Products |
| rating | Int | Rating score |
| comment | Text? | Review content |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- Belongs to one User.
- Belongs to one Product.


### 3.12. Sessions

Stores user authentication sessions.

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| id | UUID | Primary key |
| userId | UUID | Foreign key to Users |
| tokenHash | String | Hashed refresh token |
| expiresAt | DateTime | Session expiration time |
| revokedAt | DateTime? | Session revocation time |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Relationships**

- Belongs to one User.


## 4. Entity Relationships

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


## 5. Data Constraints

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

- All tables use UUID as the primary key.
- Product_Notes uses a composite primary key (`productId`, `noteId`).

### 5.3. Indexes

#### Users

- createdAt

#### Products

- name
- brand
- categoryId

#### Product_Variants

- productId
- price

#### Product_Notes

- noteId
- layerType

#### Cart_Items

- variantId

#### Orders

- (`userId`, `createdAt`)
- status

#### Order_Items

- variantId

#### Reviews

- (`productId`, `createdAt`)
- userId

#### Sessions

- userId
- expiresAt


## 6. ON DELETE Policies

| Relationship | Delete Policy |
|--------------|---------------|
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


## 7. Implementation Guidelines

- Use **Prisma ORM** for schema management and database migrations.
- Use **PostgreSQL** as the relational database management system.
- Manage database changes through **Prisma Migrate**.
- Maintain a `seed.ts` or `seed.js` file to generate sample data for development and testing.
- Store the purchase price in `Order_Items.priceAtPurchase` to preserve historical pricing even if product prices change later.
- Use UUID as the primary key for all tables to improve scalability and facilitate distributed system integration.