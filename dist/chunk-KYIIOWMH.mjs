import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trip/update_trip.ts
import { z } from "zod";
import dayjs from "dayjs";
async function updateTrips(app) {
  app.withTypeProvider().put(
    "/trips/:tripId",
    {
      schema: {
        description: "Update a trip",
        tags: ["Trip"],
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { destination, starts_at, ends_at } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      if (dayjs(starts_at).isBefore(/* @__PURE__ */ new Date())) {
        throw new ClientError("Start date must be in the future");
      }
      if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
        throw new ClientError("End date must be after start date");
      }
      await prisma.trip.update({
        where: { id: tripId },
        data: {
          destination,
          starts_at,
          ends_at
        }
      });
      return reply.status(201).send({ tripId: trip.id });
    }
  );
}

export {
  updateTrips
};
