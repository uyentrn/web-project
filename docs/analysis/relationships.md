# Relationship Analysis

## Explicit relationships

```text
User 1 --- * Order 1 --- * OrderItem * --- 1 ProductVariant * --- 1 Product
Product * --- * Note (through ProductNotesMap, with layer_type)
```

- Each order item references one product variant and stores the price at the time of purchase.
- Each product variant belongs to a product.
- Product-note membership is many-to-many and the mapping stores `top`, `heart`, or `base`.
- The documentation requires cascading deletion for dependent records such as order items and product variants, but does not state precise foreign-key directions or retention policy.

## Relationships implied by the API

```text
User 1 --- 1 Cart 1 --- * CartItem * --- 1 ProductVariant
User 1 --- * Review * --- 1 Product
Product * --- ? Category
User 1 --- * RefreshToken/Session
```

- A user needs a persistent current cart; its lifecycle and whether an empty cart exists immediately are unspecified.
- Cart items reference a selected variant, not merely a product.
- A review belongs to a user and product, and authorization requires evidence that the user purchased that product. The exact qualifying order status is not supplied.
- The API describes categories as scent groups/brands while the database specification describes product categories. Whether brands are categories or an independent entity is unresolved.

## Integrity and lifecycle concerns

Use foreign keys and Prisma migrations. `OrderItem.price_at_purchase` must remain immutable after checkout even if a variant price changes. Cascading a deleted product variant into historical order items would destroy purchase history, so the general cascade guidance conflicts with the need to preserve orders and requires a product-retention decision before implementation.
