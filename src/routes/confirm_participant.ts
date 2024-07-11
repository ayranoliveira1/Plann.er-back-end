import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/clientError";
import { env } from "../env";

export async function comfirmParticipant(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().get(
      "/participants/:partcipantId/confirm",
      {
         schema: {
            params: z.object({
               partcipantId: z.string().uuid(),
            }),
         },
      },
      async (request, reply) => {
         const { partcipantId } = request.params;

         const participant = await prisma.participant.findUnique({
            where: {
               id: partcipantId,
            },
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
            data: { is_confirmed: true },
         });

         return reply.redirect(
            `${env.WEB_BASE_URL}/trips/${participant.trip_id}`
         );
      }
   );
}
