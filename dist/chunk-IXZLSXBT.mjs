import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/activity/get_activities.ts
import { z } from "zod";
import dayjs from "dayjs";
async function getActivity(app) {
  app.withTypeProvider().get(
    "/trips/:tripId/activities",
    {
      schema: {
        description: "Get activities",
        tags: ["Activity"],
        params: z.object({
          tripId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          activities: {
            orderBy: {
              occurs_at: "asc"
            }
          }
        }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      const differenceInDaysBetweenTripStartAndEnd = dayjs(
        trip.ends_at
      ).diff(trip.starts_at, "days");
      const activities = Array.from({
        length: differenceInDaysBetweenTripStartAndEnd + 1
      }).map((_, index) => {
        const date = dayjs(trip.starts_at).add(index, "days");
        return {
          date: date.toDate(),
          activities: trip.activities.filter((activity) => {
            return dayjs(activity.occurs_at).isSame(date, "day");
          })
        };
      });
      return reply.status(201).send({ activities });
    }
  );
}

export {
  getActivity
};
