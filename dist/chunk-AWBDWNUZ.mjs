import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trip/get_trip_details.ts
import { z } from "zod";
async function getTripDetails(app) {
  app.withTypeProvider().get(
    "/trips/:tripId",
    {
      schema: {
        description: "Get trip details",
        tags: ["Trip"],
        params: z.object({
          tripId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        select: {
          id: true,
          destination: true,
          starts_at: true,
          ends_at: true,
          is_confirmed: true
        },
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      return reply.status(201).send({ trip });
    }
  );
}

export {
  getTripDetails
};
