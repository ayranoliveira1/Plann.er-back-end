import { prisma } from "../lib/prisma";

interface ICreateTripParams {
   destination: string;
   starts_at: Date;
   ends_at: Date;
   owner_name: string;
   owner_email: string;
   emails_to_invite: string[];
}

export class TripRepository {
   async create({
      destination,
      starts_at,
      ends_at,
      owner_name,
      owner_email,
      emails_to_invite,
   }: ICreateTripParams) {
      const trip = await prisma.trip.create({
         data: {
            destination,
            starts_at,
            ends_at,
            participants: {
               createMany: {
                  data: [
                     {
                        name: owner_name,
                        email: owner_email,
                        is_owner: true,
                        is_confirmed: true,
                     },

                     ...emails_to_invite.map((email: string) => {
                        return { email };
                     }),
                  ],
               },
            },
         },
      });

      return trip;
   }
}
