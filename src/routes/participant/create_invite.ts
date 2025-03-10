import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../erros/clientError";
import { getMailClinet } from "../../lib/mail";
import { env } from "../../env";
import { ParticipantRepository } from "../../repositories/create_new_participant";

export async function createInvite(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().post(
      "/trips/:tripId/invites",
      {
         schema: {
            description: "Create a new invite",
            tags: ["Participant"],
            params: z.object({
               tripId: z.string().uuid(),
            }),
            body: z.object({
               name: z.string().min(4),
               email: z.string().email(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId } = request.params;
         const { email, name } = request.body;

         const trip = await prisma.trip.findUnique({
            where: { id: tripId },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         // create participant
         const participantRepository = new ParticipantRepository();
         const participant = await participantRepository.create({
            name,
            email,
            trip_id: tripId,
         });

         const formattedStartDate = dayjs(trip.starts_at).format("DD/MM/YYYY");

         const formattedEndDate = dayjs(trip.ends_at).format("DD/MM/YYYY");

         const mail = await getMailClinet();

         const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;

         const message = await mail.sendMail({
            from: {
               name: "Equipe Plann.er",
               address: "equipe@planner.com",
            },
            to: participant.email,
            subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
            html: `
               <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                 <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                 <p></p>
                 <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                 <p></p>
                 <p>
                   <a href="${confirmationLink}">Confirmar viagem</a>
                 </p>
                 <p></p>
                 <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
               </div>`.trim(),
         });

         console.log(nodemailer.getTestMessageUrl(message));

         return reply.status(201).send({ participantId: participant.id });
      }
   );
}
