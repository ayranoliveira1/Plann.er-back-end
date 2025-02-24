import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../erros/clientError";

export async function getParticipants(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/participants",
      {
         schema: {
            description: "Get all participants",
            tags: ["Participant"],
            params: z.object({
               tripId: z.string().uuid(),
            }),
         },
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
                     is_confirmed: true,
                  },
               },
            },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         return reply.status(201).send({ participants: trip.participants });
      }
   );
}
