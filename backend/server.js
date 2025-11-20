import "dotenv/config.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 4000;

try {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("❌ Error al iniciar servidor:", error);
  process.exit(1);
}
