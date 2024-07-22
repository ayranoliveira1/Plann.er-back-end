import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/repositories/create_new_activity.ts
var ActivityRepository = class {
  async create({ title, occurs_at, trip_id }) {
    const activity = await prisma.activity.create({
      data: {
        title,
        occurs_at,
        trip_id
      }
    });
    return activity;
  }
};

export {
  ActivityRepository
};
