import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/link/get_links.ts
import { z } from "zod";
async function getLinks(app) {
  app.withTypeProvider().get(
    "/trips/:tripId/links",
    {
      schema: {
        description: "Get all links",
        tags: ["Link"],
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
          links: true
        }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      return reply.status(201).send({ links: trip.links });
    }
  );
}

export {
  getLinks
};
