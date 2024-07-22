import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/participant/get_participants.ts
import { z } from "zod";
async function getParticipants(app) {
  app.withTypeProvider().get(
    "/trips/:tripId/participants",
    {
      schema: {
        description: "Get all participants",
        tags: ["Participant"],
        params: z.object({
          tripId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
              is_confirmed: true
            }
          }
        }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      return reply.status(201).send({ participants: trip.participants });
    }
  );
}

export {
  getParticipants
};
