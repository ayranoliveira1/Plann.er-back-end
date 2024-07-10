import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
import { ClientError } from "../erros/clientError";

export async function updateTrips(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().put(
      "/trips/:tripId",
      {
         schema: {
            params: z.object({
               tripId: z.string().uuid(),
            }),
            body: z.object({
               destination: z.string().min(4),
               starts_at: z.coerce.date(),
               ends_at: z.coerce.date(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId } = request.params;
         const { destination, starts_at, ends_at } = request.body;

         const trip = await prisma.trip.findUnique({
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         if (dayjs(starts_at).isBefore(new Date())) {
            throw new ClientError("Start date must be in the future");
         }

         if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
            throw new ClientError("End date must be after start date");
         }

         await prisma.trip.update({
            where: { id: tripId },
            data: {
               destination,
               starts_at,
               ends_at,
            },
         });

         return reply.status(201).send({ tripId: trip.id });
      }
   );
}
