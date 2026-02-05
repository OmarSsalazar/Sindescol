import "dotenv/config.js";
import bcrypt from "bcryptjs";
import db from "./src/config/db.js";

const insertTestUser = async () => {
  try {
    console.log("🔄 Insertando usuario de prueba...");

    // Datos del usuario de prueba
    const email = "admin@presidencia.com";
    const password = "Admin123!";
    const nombre = "Administrador Presidencia Nacional";
    const celular = "3001234567";
    const rol = "presidencia_nacional";
    const departamento = "Presidencia Nacional";

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await db.query(
      `INSERT INTO usuarios (email, password_hash, nombre, celular, rol, departamento, activo) 
       VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [email, passwordHash, nombre, celular, rol, departamento]
    );

    console.log("✅ Usuario insertado exitosamente!");
    console.log("\n📋 Credenciales de prueba:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Rol:      ${rol}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al insertar usuario:", error.message);
    process.exit(1);
  }
};

insertTestUser();
