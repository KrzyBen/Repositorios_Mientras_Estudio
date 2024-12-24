// menu.entity.js
"use strict";
import { EntitySchema } from "typeorm";

const MenuSchema = new EntitySchema({
  name: "Menu",
  tableName: "menus",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 50,
      default: "disponible",
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    menuBatchItems: {
      target: "MenuBatchItem",
      type: "one-to-many",
      inverseSide: "menu",
      cascade: ["insert", "update"],
      eager: true,
    },
  },
});

export default MenuSchema;