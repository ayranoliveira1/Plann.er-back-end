import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/participant/delete_participant.ts
import { z } from "zod";
async function deleteParticipant(app) {
  app.withTypeProvider().delete(
    "/trips/:tripId/participants/:participantId",
    {
      schema: {
        description: "Delete a participant",
        tags: ["Participant"],
        params: z.object({
          tripId: z.string().uuid(),
          participantId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { tripId, participantId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      if (!participantId) {
        throw new ClientError("Activity not found");
      }
      await prisma.participant.delete({
        where: { id: participantId }
      });
      return reply.status(201).send({ message: "Participant deleted" });
    }
  );
}

export {
  deleteParticipant
};
