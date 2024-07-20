import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../erros/clientError";

export async function deleteParticipant(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().delete(
      "/trips/:tripId/participants/:participantId",
      {
         schema: {
            description: "Delete a participant",
            tags: ["Participant"],
            params: z.object({
               tripId: z.string().uuid(),
               participantId: z.string().uuid(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId, participantId } = request.params;

         const trip = await prisma.trip.findUnique({
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         if (!participantId) {
            throw new ClientError("Activity not found");
         }

         await prisma.participant.delete({
            where: { id: participantId },
         });

         return reply.status(201).send({ message: "Participant deleted" });
      }
   );
}
