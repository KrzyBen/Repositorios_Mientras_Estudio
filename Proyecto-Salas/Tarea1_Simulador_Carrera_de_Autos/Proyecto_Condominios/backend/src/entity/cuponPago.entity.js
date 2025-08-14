'use strict';
import { EntitySchema } from "typeorm";

const CuponPagoSchema = new EntitySchema({
  name: "CuponPago",
  tableName: "cupones_pago",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    mes: {
      type: "int",
      nullable: false,
    },
    año: {
      type: "int",
      nullable: false,
    },
    monto: {
      type: "int",
      default: 1000,
      nullable: false,
    },
    montoDescuento: {
      type: "int",
      default: 0,
    },
    descripcionPago: {
      type: "varchar",
      length: 255,
      default: "Pago de cuota Mensual",
      nullable: false, 
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "pendiente",
    },
    tipo: {
      type: "varchar",
      length: 50,
      default: "mensual",
      nullable: false,
    },
    fechaPago: {
      name: "fecha_pago",
      type: "date",
      nullable: true,
    },
    fechaCompromiso: {
      name: "fecha_compromiso",
      type: "date",
      nullable: true,
    },
    archivoPDF: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    ordenWebpay: {
      type: "varchar",
      length: 50,  
      nullable: true,
    },
  },
  relations: {
    vecino: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "vecino_id",
      },
      onDelete: "CASCADE",
    },
  }
});

export default CuponPagoSchema;