"use strict";
import { EntitySchema } from "typeorm";

const TurnoSchema = new EntitySchema({
  name: "Shift",
  tableName: "Shifts",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombreCompleto: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    horarioTrabajo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    empleado: {
      target: "Employee",
      type: "many-to-one",
      joinColumn: true,
      onDelete: "CASCADE",
    },
  },
});

export default TurnoSchema;
