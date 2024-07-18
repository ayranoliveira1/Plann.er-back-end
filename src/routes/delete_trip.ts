import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../erros/clientError";

export async function deleteTrip(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().delete(
      "/trips/:tripId",
      {
         schema: {
            params: z.object({
               tripId: z.string().uuid(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId } = request.params;

         const trip = await prisma.trip.findUnique({
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         await prisma.trip.delete({
            where: { id: tripId },
         });

         return reply.status(200).send({ message: "Trip deleted" });
      }
   );
}
