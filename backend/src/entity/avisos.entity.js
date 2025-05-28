'use strict'
// avisos.entity.js

import { EntitySchema } from "typeorm";

const Aviso = new EntitySchema({
  name: "Aviso",
  tableName: "avisos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    titulo: {
      type: "varchar",
      length: 100,
    },
    descripcion: {
      type: "text",
    },
    tipo: {
      type: "varchar",
      length: 50,
    },
    creadoPor: {
      type: "varchar",
    },
    usuarioId: {
      type: "int",
      nullable: true,
    },
    visible: {
      type: "boolean",
      default: true,
    },
    apropiado: {
      type: "boolean",
      nullable: true,
    },
    estado: {
      type: "varchar",
      default: "pendiente", // pendiente, pendiente_aprobacion, publicado, rechazado, desactivado
    },
    fechaCreacion: {
      type: "date",
      default: () => "CURRENT_TIMESTAMP",
    },
    fechaExpiracion: {
      type: "date",
      nullable: true,
    },
  },
});

export default Aviso;
