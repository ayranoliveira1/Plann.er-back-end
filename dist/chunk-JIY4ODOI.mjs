import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/repositories/create_new_link.ts
var LinkRepository = class {
  async create({ title, url, trip_id }) {
    const link = await prisma.link.create({
      data: {
        title,
        url,
        trip_id
      }
    });
    return link;
  }
};

export {
  LinkRepository
};
