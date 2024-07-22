import {
  LinkRepository
} from "./chunk-JIY4ODOI.mjs";
import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/link/create_link.ts
import { z } from "zod";
async function createLink(app) {
  app.withTypeProvider().post(
    "/trips/:tripId/links",
    {
      schema: {
        description: "Create a new link",
        tags: ["Link"],
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { title, url } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      const linkRepository = new LinkRepository();
      const link = await linkRepository.create({
        title,
        url,
        trip_id: tripId
      });
      return reply.status(201).send({ linkId: link.id });
    }
  );
}

export {
  createLink
};
