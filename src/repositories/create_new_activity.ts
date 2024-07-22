import { prisma } from "../lib/prisma";

interface ICreateParams {
   title: string;
   occurs_at: Date;
   trip_id: string;
}

export class ActivityRepository {
   async create({ title, occurs_at, trip_id }: ICreateParams) {
      const activity = await prisma.activity.create({
         data: {
            title,
            occurs_at,
            trip_id,
         },
      });

      return activity;
   }
}
