import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../erros/clientError";

export async function getActivity(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/activities",
      {
         schema: {
            description: "Get activities",
            tags: ["Activity"],
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
               activities: {
                  orderBy: {
                     occurs_at: "asc",
                  },
               },
            },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         const differenceInDaysBetweenTripStartAndEnd = dayjs(
            trip.ends_at
         ).diff(trip.starts_at, "days");

         const activities = Array.from({
            length: differenceInDaysBetweenTripStartAndEnd + 1,
         }).map((_, index) => {
            const date = dayjs(trip.starts_at).add(index, "days");

            return {
               date: date.toDate(),
               activities: trip.activities.filter((activity) => {
                  return dayjs(activity.occurs_at).isSame(date, "day");
               }),
            };
         });

         return reply.status(201).send({ activities });
      }
   );
}
