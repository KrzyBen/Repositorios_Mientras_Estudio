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
          nombreCompleto: "Benjamin Antonio Manriquez Ramirez",
          rut: "20.464.375-K",
          email: "administradorB2025@gmail.cl",
          password: await encryptPassword("adminb1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Valter Lineros",
          rut: "22.827.048-2",
          email: "administradorV2025@gmail.cl",
          password: await encryptPassword("adminv1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Fernando Flores",
          rut: "17181965-2",
          email: "administradorF22025@gmail.cl",
          password: await encryptPassword("adminf1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juanito Perez",
          rut: "17377026-k",
          email: "vecino2025@gmail.cl",
          password: await encryptPassword("vecino1234"),
          rol: "vecino",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Alberto Perez",
          rut: "16116015-6",
          email: "encargadop2025@gmail.cl",
          password: await encryptPassword("encargadop1234"),
          rol: "encargado_P",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Sanchez",
          rut: "10692349-3",
          email: "encargador2025@gmail.cl",
          password: await encryptPassword("encargador1234"),
          rol: "encargado_R",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Jilberto Cabrera",
          rut: "13335329-1",
          email: "encargadoa2025@gmail.cl",
          password: await encryptPassword("encargadoa1234"),
          rol: "encargado_A",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };