"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Jorge Antonio Martinez Henriquez",
          rut: "21.069.508-7",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Fernando Alberto Flores Cruces",
          rut: "20.940.422-2",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Benjamín Antonio Manríquez Ramírez",
          rut: "20.464.375-K",
          email: "adminisBJM22024@gmail.cl",
          password: await encryptPassword("admin221234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Valter Sergio Esau Lineros Zambrano",
          rut: "20.487.531-6",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Carlos Ramírez López",
          rut: "19.876.543-1",
          email: "cocinero2024@gmail.cl",
          password: await encryptPassword("cocinero1234"),
          rol: "cocinero",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Lucía González Carrera",
          rut: "18.654.321-0",
          email: "mesero2024@gmail.cl",
          password: await encryptPassword("mesero1234"),
          rol: "mesero",
        }),
      ),

      userRepository.save(
        userRepository.create({
          nombreCompleto: "Claudia Isabel Navarro Cortés",
          rut: "19.451.120-8",
          email: "usuario5@gmail.cl",
          password: await encryptPassword("user5678"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Martina Fabiola Díaz Morales",
          rut: "18.435.617-9",
          email: "mesero2@gmail.cl",
          password: await encryptPassword("mesero5678"),
          rol: "mesero",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pedro Pastal Silva López",
          rut: "21.763.909-3",
          email: "cocinero2@gmail.cl",
          password: await encryptPassword("cocinero5678"),
          rol: "cocinero",
        }),
      ),

      userRepository.save(
        userRepository.create({
          nombreCompleto: "Sara Elizabeth Herrera Castillo",
          rut: "20.123.543-4",
          email: "usuario4@gmail.cl",
          password: await encryptPassword("user4321"),
          rol: "usuario",
        }),
      ),

      userRepository.save(
        userRepository.create({
          nombreCompleto: "Claudia Isabel Navarro Cortés",
          rut: "19.451.120-8",
          email: "usuario5@gmail.cl",
          password: await encryptPassword("user5678"),
          rol: "usuario",
        }),
      ),

      userRepository.save(
        userRepository.create({
          nombreCompleto: "Javier Hernández López",
          rut: "21.562.763-4",
          email: "mesero3@gmail.cl",
          password: await encryptPassword("mesero6789"),
          rol: "mesero",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Patricia López Hernández",
          rut: "20.234.122-5",
          email: "mesera4@gmail.cl",
          password: await encryptPassword("mesera7890"),
          rol: "mesero",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Marco Antonio Rivas",
          rut: "21.343.222-6",
          email: "cocinero3@gmail.cl",
          password: await encryptPassword("cocinero7890"),
          rol: "cocinero",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Isabel María Reyes",
          rut: "19.334.882-7",
          email: "cocinera4@gmail.cl",
          password: await encryptPassword("cocinera1234"),
          rol: "cocinero",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Carlos Alberto Silva",
          rut: "18.234.124-9",
          email: "cocinero4@gmail.cl",
          password: await encryptPassword("cocinero4321"),
          rol: "cocinero",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Verónica Mendoza Rosales",
          rut: "21.211.334-0",
          email: "mesero5@gmail.cl",
          password: await encryptPassword("mesero4321"),
          rol: "mesero",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };
