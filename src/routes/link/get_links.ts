import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../erros/clientError";

export async function getLinks(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/links",
      {
         schema: {
            description: "Get all links",
            tags: ["Link"],
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
               links: true,
            },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         return reply.status(201).send({ links: trip.links });
      }
   );
}
