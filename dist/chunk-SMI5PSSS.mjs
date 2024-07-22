import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/participant/get_participant.ts
import { z } from "zod";
async function getParticipant(app) {
  app.withTypeProvider().get(
    "/participants/:participantId",
    {
      schema: {
        description: "Get a participant",
        tags: ["Participant"],
        params: z.object({
          participantId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { participantId } = request.params;
      const participant = await prisma.participant.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true
        },
        where: { id: participantId }
      });
      if (!participant) {
        throw new ClientError("Trip not found");
      }
      return reply.status(201).send({ participant });
    }
  );
}

export {
  getParticipant
};
