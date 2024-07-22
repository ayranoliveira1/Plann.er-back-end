import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/repositories/create_new_trip.ts
var TripRepository = class {
  async create({
    destination,
    starts_at,
    ends_at,
    owner_name,
    owner_email,
    emails_to_invite
  }) {
    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_owner: true,
                is_confirmed: true
              },
              ...emails_to_invite.map((email) => {
                return { email };
              })
            ]
          }
        }
      }
    });
    return trip;
  }
};

export {
  TripRepository
};
