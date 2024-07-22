import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  ActivityRepository
} from "./chunk-KWN5LNQQ.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/activity/create_activity.ts
import { z } from "zod";
import dayjs from "dayjs";
async function createActivity(app) {
  app.withTypeProvider().post(
    "/trips/:tripId/activities",
    {
      schema: {
        description: "Create a new activity",
        tags: ["Activity"],
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { title, occurs_at } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      if (dayjs(occurs_at).isBefore(/* @__PURE__ */ new Date())) {
        throw new ClientError("Start date must be in the future");
      }
      if (dayjs(occurs_at).isAfter(dayjs(trip.ends_at))) {
        throw new ClientError("Start date must be before trip end date");
      }
      const activityRepository = new ActivityRepository();
      const activity = await activityRepository.create({
        title,
        occurs_at,
        trip_id: tripId
      });
      return reply.status(201).send({ activitiesId: activity.id });
    }
  );
}

export {
  createActivity
};
