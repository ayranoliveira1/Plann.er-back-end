import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../erros/clientError";
import { getMailClinet } from "../../lib/mail";
import { env } from "../../env";

export async function comfirmTrips(app: FastifyInstance) {
   app.withTypeProvider<ZodTypeProvider>().get(
      "/trips/:tripId/confirm",
      {
         schema: {
            description: "Confirm trip",
            tags: ["Trip"],
            params: z.object({
               tripId: z.string(),
            }),
         },
      },
      async (request, reply) => {
         const { tripId } = request.params;

         const trip = await prisma.trip.findUnique({
            where: {
               id: tripId,
            },

            include: {
               participants: {
                  where: {
                     is_owner: false,
                  },
               },
            },
         });

         if (!trip) {
            throw new ClientError("Trip not found");
         }

         if (trip.is_confirmed) {
            return reply.redirect(
               `${env.WEB_BASE_URL || "http://localhost:5173"}/trips/${tripId}`
            );
         }

         await prisma.trip.update({
            where: { id: tripId },
            data: { is_confirmed: true },
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
            })
         );

         return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`);
      }
   );
}
