import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/link/delete-links.ts
import z from "zod";
async function deleteLink(app) {
  app.withTypeProvider().delete(
    "/trips/:tripId/links/:linkId",
    {
      schema: {
        description: "Delete a link",
        tags: ["Link"],
        params: z.object({
          tripId: z.string().uuid(),
          linkId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { tripId, linkId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      if (!linkId) {
        throw new ClientError("Link not found");
      }
      await prisma.link.delete({
        where: { id: linkId }
      });
      return reply.status(201).send({ message: "Link deleted" });
    }
  );
}

export {
  deleteLink
};
