import {
  ParticipantRepository
} from "./chunk-HPRDTAUL.mjs";
import {
  env
} from "./chunk-K5HYBPQ7.mjs";
import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  getMailClinet
} from "./chunk-Z2A7SPP6.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/participant/create_invite.ts
import { z } from "zod";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
async function createInvite(app) {
  app.withTypeProvider().post(
    "/trips/:tripId/invites",
    {
      schema: {
        description: "Create a new invite",
        tags: ["Participant"],
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          name: z.string().min(4),
          email: z.string().email()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { email, name } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      const participantRepository = new ParticipantRepository();
      const participant = await participantRepository.create({
        name,
        email,
        trip_id: tripId
      });
      const formattedStartDate = dayjs(trip.starts_at).format("DD/MM/YYYY");
      const formattedEndDate = dayjs(trip.ends_at).format("DD/MM/YYYY");
      const mail = await getMailClinet();
      const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;
      const message = await mail.sendMail({
        from: {
          name: "Equipe Plann.er",
          address: "equipe@planner.com"
        },
        to: participant.email,
        subject: `Confirme sua presen\xE7a na viagem para ${trip.destination} em ${formattedStartDate}`,
        html: `
               <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                 <p>Voc\xEA foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> at\xE9 <strong>${formattedEndDate}</strong>.</p>
                 <p></p>
                 <p>Para confirmar sua presen\xE7a na viagem, clique no link abaixo:</p>
                 <p></p>
                 <p>
                   <a href="${confirmationLink}">Confirmar viagem</a>
                 </p>
                 <p></p>
                 <p>Caso voc\xEA n\xE3o saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
               </div>`.trim()
      });
      console.log(nodemailer.getTestMessageUrl(message));
      return reply.status(201).send({ participantId: participant.id });
    }
  );
}

export {
  createInvite
};
