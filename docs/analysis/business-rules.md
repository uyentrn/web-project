# Business Rules

1. Authentication creates access and refresh credentials; access must be refreshable and logout must invalidate the applicable session.
2. Cart operations are scoped to the authenticated user; a caller must never access another user's cart or cart items.
3. Cart lines select product variants and carry quantities.
4. Checkout converts a user's cart to an order, calculates the order total, and checks current stock before completing the conversion.
5. An order records `total_amount`, shipping address, and one of: `pending`, `paid`, `shipping`, `completed`, `cancelled`.
6. Each order item snapshots `price_at_purchase`, protecting historical totals from later product-price changes.
7. Product details include scent notes and their pyramid position: top, heart, or base.
8. Product discovery supports category, scent, and minimum-price filters, plus name search.
9. Only an authenticated verified purchaser of a product may submit its review; anyone may retrieve reviews.
10. Dependent data must not become orphaned; deletion behavior must respect the documented cascade requirement and historical order preservation.

Rules for price changes, stock reservation/decrement timing, order-status transitions, cancellations/refunds, duplicate reviews, and account lifecycle are not specified and must be resolved before implementation.
