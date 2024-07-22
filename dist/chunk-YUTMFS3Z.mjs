import {
  env
} from "./chunk-K5HYBPQ7.mjs";
import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/participant/confirm_participant.ts
import { z } from "zod";
async function comfirmParticipant(app) {
  app.withTypeProvider().get(
    "/participants/:partcipantId/confirm",
    {
      schema: {
        description: "Confirm participant",
        tags: ["Participant"],
        params: z.object({
          partcipantId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { partcipantId } = request.params;
      const participant = await prisma.participant.findUnique({
        where: {
          id: partcipantId
        }
      });
      if (!participant) {
        throw new ClientError("Participant not found");
      }
      if (participant.is_confirmed) {
        return reply.redirect(
          `${env.WEB_BASE_URL}/trips/${participant.trip_id}`
        );
      }
      await prisma.participant.update({
        where: { id: partcipantId },
        data: { is_confirmed: true }
      });
      return reply.redirect(
        `${env.WEB_BASE_URL}/trips/${participant.trip_id}`
      );
    }
  );
}

export {
  comfirmParticipant
};
