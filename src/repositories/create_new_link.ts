import { prisma } from "../lib/prisma";

interface ICreateLinkParams {
   title: string;
   url: string;
   trip_id: string;
}

export class LinkRepository {
   async create({ title, url, trip_id }: ICreateLinkParams) {
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
