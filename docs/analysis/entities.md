# Entity Analysis

| Entity | Required data or responsibility |
| --- | --- |
| User | Central user profile/account record; exact profile and credential fields are unspecified. |
| Product | Perfume catalog record with name, brand, description, and image. |
| ProductVariant | Sellable SKU of a product, defined by size (such as 30ml/50ml/100ml) and concentration (such as EDP/EDT); stock and price are implied by checkout and purchase snapshots. |
| Category | Product classification, e.g. Floral, Woody, or Citrus. The exact relationship cardinality is unspecified. |
| Note | Master fragrance-component record, e.g. Bergamot or Rose. |
| ProductNotesMap | Product-to-note association carrying scent-pyramid layer: `top`, `heart`, or `base`. |
| Cart | Persistent cart belonging to the current user. It is required by API behavior but absent from the database specification. |
| CartItem | Cart line containing a product variant and quantity. It is required by API behavior but absent from the database specification. |
| Order | Checkout header containing `total_amount`, `status`, and `shipping_address`. Status values: `pending`, `paid`, `shipping`, `completed`, `cancelled`. |
| OrderItem | Order line joining an order to a product variant and retaining `price_at_purchase`. |
| Review | Product rating/review authored by a verified purchaser. Required by API behavior but field design is unspecified. |
| RefreshToken/Session | Server-side representation needed to invalidate logout sessions and refresh tokens; not explicitly modeled in the database specification. |

Monetary values should ultimately use a fixed-precision PostgreSQL/Prisma decimal type rather than floating-point representation; this is an implementation recommendation, not an explicit source requirement.
