# Database Schema Design: Perfume E-Commerce

## 1. User & Order Data
- **Users**: Central repository for user profiles.
- **Orders**: Header info including `total_amount`, `status` (Enum: pending, paid, shipping, completed, cancelled), and `shipping_address`.
- **Order_Items**: Junction table linking Orders to specific Product_Variants. Essential: store `price_at_purchase` as a snapshot to handle future price changes.

## 2. Product Inventory
- **Products**: Basic info (name, brand, description, image).
- **Product_Variants**: Manages stock keeping units (SKUs) based on size (e.g., 30ml, 50ml, 100ml) and concentration (EDP, EDT).
- **Categories**: Product classification for filtering (Floral, Woody, Citrus, etc.).

## 3. Scent Pyramid
- **Notes**: Master list of fragrance components (e.g., Bergamot, Rose).
- **Product_Notes_Map**: Maps products to notes and defines the position in the scent pyramid (`layer_type`: top, heart, base).

## 4. Implementation Guidelines
- **ORM Recommendation**: Use an ORM (Prisma for Node.js, SQLAlchemy for Python) to manage database migrations and model definitions.
- **Data Integrity**: Enforce `ON DELETE CASCADE` for relationships like `Order_Items` or `Product_Variants` to prevent orphaned records.
- **Testing**: Always maintain a `seed.py` or `seed.js` script to populate test data for rapid development.