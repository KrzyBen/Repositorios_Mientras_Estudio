"use strict";
import { EntitySchema } from "typeorm";

const purchaseBatchSchema = new EntitySchema({
  name: "PurchaseBatch",
  tableName: "purchase_batches",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
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
});

export default purchaseBatchSchema;