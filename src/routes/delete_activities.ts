import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../erros/clientError";
import { prisma } from "../lib/prisma";

export async function deleteActivities(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().delete(
      "/trips/:tripId/activities/:actvitiesId",
      {
         schema: {
            params: z.object({
               tripId: z.string().uuid(),
               actvitiesId: z.string().uuid(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId, actvitiesId } = request.params;

         const trip = await prisma.trip.findUnique({
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         if (!actvitiesId) {
            throw new ClientError("Activity not found");
         }

         await prisma.activity.delete({
            where: { id: actvitiesId },
         });

         return reply.status(201).send({ message: "Activity deleted" });
      }
   );
}
