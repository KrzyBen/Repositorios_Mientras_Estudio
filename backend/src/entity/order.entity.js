"use strict";
import { EntitySchema } from "typeorm";

const OrderSchema = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    clientName: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    menuId: {
      type: "int",
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 50,
      nullable: false,
      default: "pendiente",
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
    menu: {
      target: "Menu",
      type: "many-to-one",
      joinColumn: { name: "menuId" },
    },
  },  
});

export default OrderSchema;