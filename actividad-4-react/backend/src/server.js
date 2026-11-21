import app from './app.js';

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API de ComuniApp en http://localhost:${PORT}`);
  console.log(`Swagger en http://localhost:${PORT}/api/docs`);
});
