import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../erros/clientError";

export async function getTripDetails(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId",
      {
         schema: {
            description: "Get trip details",
            tags: ["Trip"],
            params: z.object({
               tripId: z.string().uuid(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId } = request.params;

         const trip = await prisma.trip.findUnique({
            select: {
               id: true,
               destination: true,
               starts_at: true,
               ends_at: true,
               is_confirmed: true,
            },
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         return reply.status(201).send({ trip });
      }
   );
}
