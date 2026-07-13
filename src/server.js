const { createApplication } = require('./bootstrap');

const port = Number(process.env.PORT || 3000);
const app = createApplication();

app.listen(port, () => {
  console.info(`API listening on port ${port}`);
});
