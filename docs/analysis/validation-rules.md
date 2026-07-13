# Validation Rules

## Explicitly required

- All endpoint input must be validated by middleware before controllers invoke services.
- Product listing accepts `category`, `scent`, `min_price`, `limit`, and `offset`.
- Search requires the `q` name-search query parameter.
- Add-to-cart requires `variant_id` and `quantity`.
- Cart update identifies a path `itemId` and must receive a quantity value, although its body field name is unspecified.
- Product and review endpoints identify a path product `id`; cart endpoints identify `itemId`; order detail identifies an order `id`.
- Pagination uses `limit` and `offset` and must be enforced to protect resources.
- A review submission must pass verified-purchaser authorization in addition to ordinary input validation.

## Required specification decisions

The source material does not define identifier format, required registration/login fields, password policy, numeric ranges, quantity bounds, pagination defaults/maximums, search length, price scale/currency, permitted category/scent formats, shipping-address schema, review/rating schema, or enum validation for write operations. These are tracked in `questions.md` and must be specified before validation code is written.
