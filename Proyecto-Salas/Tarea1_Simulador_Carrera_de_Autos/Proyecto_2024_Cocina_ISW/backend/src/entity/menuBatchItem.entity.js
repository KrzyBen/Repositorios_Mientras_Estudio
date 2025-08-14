// menuBatchItem.entity.js
"use strict";
import { EntitySchema } from "typeorm";

const MenuBatchItemSchema = new EntitySchema({
  name: "MenuBatchItem",
  tableName: "menu_batch_items",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    quantity: {
      type: "int",
      nullable: false,
      default: 1,
    },
  },
  relations: {
    menu: {
      target: "Menu",
      type: "many-to-one",
      joinColumn: { name: "menu_id", referencedColumnName: "id" },
    },
    batchItem: {
      target: "PurchaseBatch",
      type: "many-to-one",
      joinColumn: { name: "batch_item_id", referencedColumnName: "id" },
    },
  },
});

export default MenuBatchItemSchema;