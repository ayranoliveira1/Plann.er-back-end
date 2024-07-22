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

// src/routes/trip/confirm_trip.ts
import { z } from "zod";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
async function comfirmTrips(app) {
  app.withTypeProvider().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        description: "Confirm trip",
        tags: ["Trip"],
        params: z.object({
          tripId: z.string()
        })
      }
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId
        },
        include: {
          participants: {
            where: {
              is_owner: false
            }
          }
        }
      });
      if (!trip) {
        throw new ClientError("Trip not found");
      }
      if (trip.is_confirmed) {
        return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
      }
      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true }
      });
      const formattedStartDate = dayjs(trip.starts_at).format("DD/MM/YYYY");
      const formattedEndDate = dayjs(trip.ends_at).format("DD/MM/YYYY");
      const email = await getMailClinet();
      await Promise.all(
        trip.participants.map(async (participant) => {
          const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;
          const message = await email.sendMail({
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
        })
      );
      return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
    }
  );
}

export {
  comfirmTrips
};
