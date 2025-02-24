import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../../erros/clientError";
import { LinkRepository } from "../../repositories/create_new_link";

export async function createLink(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().post(
      "/trips/:tripId/links",
      {
         schema: {
            description: "Create a new link",
            tags: ["Link"],
            params: z.object({
               tripId: z.string().uuid(),
            }),
            body: z.object({
               title: z.string().min(4),
               url: z.string().url(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId } = request.params;
         const { title, url } = request.body;

         const trip = await prisma.trip.findUnique({
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         // create links
         const linkRepository = new LinkRepository();
         const link = await linkRepository.create({
            title,
            url,
            trip_id: tripId,
         });

         return reply.status(201).send({ linkId: link.id });
      }
   );
}
