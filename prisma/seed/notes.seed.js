const notes = require('../data/notes');

module.exports = async function seedNotes(prisma) {
  const result = [];

  for (const note of notes) {
    const created = await prisma.note.upsert({
      where: {
        name: note.name,
      },
      update: {},
      create: {
        name: note.name,
      },
    });

    result.push(created);
  }

  return result;
};