import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";

export async function createActivity(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().post(
      "/trips/:tripId/activities",
      {
         schema: {
            description: "Create a new activity",
            tags: ["Activity"],
            params: z.object({
               tripId: z.string().uuid(),
            }),
            body: z.object({
               title: z.string().min(4),
               occurs_at: z.coerce.date(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId } = request.params;
         const { title, occurs_at } = request.body;

         const trip = await prisma.trip.findUnique({
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         if (dayjs(occurs_at).isBefore(new Date())) {
            throw new ClientError("Start date must be in the future");
         }

         if (dayjs(occurs_at).isAfter(dayjs(trip.ends_at))) {
            throw new ClientError("Start date must be before trip end date");
         }

         const activity = await prisma.activity.create({
            data: {
               title,
               occurs_at,
               trip_id: tripId,
            },
         });

         return reply.status(201).send({ activitiesId: activity.id });
      }
   );
}
