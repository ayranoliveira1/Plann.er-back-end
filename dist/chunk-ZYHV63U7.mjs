import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/activity/delete_activities.ts
import { z } from "zod";
async function deleteActivities(app) {
  app.withTypeProvider().delete(
    "/trips/:tripId/activities/:actvitiesId",
    {
      schema: {
        description: "Delete an activity",
        tags: ["Activity"],
        params: z.object({
          tripId: z.string().uuid(),
          actvitiesId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { tripId, actvitiesId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      if (!actvitiesId) {
        throw new ClientError("Activity not found");
      }
      await prisma.activity.delete({
        where: { id: actvitiesId }
      });
      return reply.status(201).send({ message: "Activity deleted" });
    }
  );
}

export {
  deleteActivities
};
