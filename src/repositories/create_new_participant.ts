import { prisma } from "../lib/prisma";

interface ICreateParticipantParams {
   name: string;
   email: string;
   trip_id: string;
}

export class ParticipantRepository {
   async create({ name, email, trip_id }: ICreateParticipantParams) {
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
