"use strict";
import { EntitySchema } from "typeorm";

const PurchaseBatchSchema = new EntitySchema({
  name: "PurchaseBatch",
  tableName: "purchase_batches",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    batchName: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    acquisitionDate: {
      type: "date",
      nullable: false,
    },
    expirationDate: {
      type: "date",
      nullable: false,
    },
    totalItems: {
      type: "int",
      nullable: false,
    },
    originPurchase: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    status: {
      type: "enum",
      enum: ["pending", "in_stock", "expired", "out_stock"],
      default: "pending",
      nullable: false,
    },
    description: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  relations: {
    menuBatchItems: {
      target: "MenuBatchItem",
      type: "one-to-many",
      inverseSide: "batchItem",
      cascade: ["insert", "update"],
    },
  },
});

export default PurchaseBatchSchema;