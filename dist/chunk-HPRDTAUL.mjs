import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/repositories/create_new_participant.ts
var ParticipantRepository = class {
  async create({ name, email, trip_id }) {
    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        trip_id
      }
    });
    return participant;
  }
};

export {
  ParticipantRepository
};
