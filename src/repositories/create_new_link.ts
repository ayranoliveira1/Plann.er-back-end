import { prisma } from "../lib/prisma";

interface ICreateParams {
   title: string;
   url: string;
   trip_id: string;
}

export class LinkRepository {
   async create({ title, url, trip_id }: ICreateParams) {
      const link = await prisma.link.create({
         data: {
            title,
            url,
            trip_id,
         },
      });

      return link;
   }
}
