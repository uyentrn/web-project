const productNotes = require('../data/productNotes');

module.exports = async function seedProductNotes(prisma, products, notes) {
  const productMap = new Map(
    products.map((product) => [
      `${product.name}|${product.brand}`,
      product.id,
    ])
  );

  const noteMap = new Map(
    notes.map((note) => [note.name, note.id])
  );

  for (const item of productNotes) {
    const productKey = `${item.product.name}|${item.product.brand}`;
    const productId = productMap.get(productKey);

    if (!productId) {
      throw new Error(`Product not found: ${productKey}`);
    }

    for (const note of item.notes) {
      const noteId = noteMap.get(note.note);

      if (!noteId) {
        throw new Error(`Note not found: ${note.note}`);
      }

      await prisma.productNote.create({
        data: {
          productId,
          noteId,
          layerType: note.layerType,
        },
      });
    }
  }
}