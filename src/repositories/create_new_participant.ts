import { prisma } from "../lib/prisma";

interface ICreateParams {
   name: string;
   email: string;
   trip_id: string;
}

export class ParticipantRepository {
   async create({ name, email, trip_id }: ICreateParams) {
      const participant = await prisma.participant.create({
         data: {
            name,
            email,
            trip_id,
         },
      });

      return participant;
   }
}
