import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/trip/delete_trip.ts
import z from "zod";
async function deleteTrip(app) {
  app.withTypeProvider().delete(
    "/trips/:tripId",
    {
      schema: {
        description: "Delete a trip",
        tags: ["Trip"],
        params: z.object({
          tripId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      await prisma.trip.delete({
        where: { id: tripId }
      });
      return reply.status(200).send({ message: "Trip deleted" });
    }
  );
}

export {
  deleteTrip
};
