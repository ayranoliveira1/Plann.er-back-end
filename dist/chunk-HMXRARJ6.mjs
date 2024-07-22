import {
  TripRepository
} from "./chunk-PR3J22XH.mjs";
import {
  env
} from "./chunk-K5HYBPQ7.mjs";
import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";
import {
  getMailClinet
} from "./chunk-Z2A7SPP6.mjs";

// src/routes/trip/create_trips.ts
import { z } from "zod";
import dayjs from "dayjs";
import nodemailer from "nodemailer";
async function createTrips(app) {
  app.withTypeProvider().post(
    "/trips",
    {
      schema: {
        description: "Create a new trip",
        tags: ["Trip"],
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email())
        })
      }
    },
    async (request, reply) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite
      } = request.body;
      if (dayjs(starts_at).isBefore(/* @__PURE__ */ new Date())) {
        throw new ClientError("Start date must be in the future");
      }
      if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
        throw new ClientError("End date must be after start date");
      }
      const tripRepository = new TripRepository();
      const trip = await tripRepository.create({
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite
      });
      const formattedStartDate = dayjs(starts_at).format("DD/MM/YYYY");
      const formattedEndDate = dayjs(ends_at).format("DD/MM/YYYY");
      const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;
      const email = await getMailClinet();
      const message = await email.sendMail({
        from: {
          name: "Equipe Plann.er",
          address: "equipe@planner.com"
        },
        to: {
          name: owner_name,
          address: owner_email
        },
        subject: "Plann.er - Confirmac\u0327a\u0303o de inscric\u0327a\u0303o",
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Voc\xEA solicitou a cria\xE7\xE3o de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> at\xE9 <strong>${formattedEndDate}</strong>.</p>
              <p></p>
              <p>Para confirmar sua viagem, clique no link abaixo:</p>
              <p></p>
              <p>
                <a href="${confirmationLink}">Confirmar viagem</a>
              </p>
              <p></p>
              <p>Caso voc\xEA n\xE3o saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>`.trim()
      });
      console.log(nodemailer.getTestMessageUrl(message));
      return reply.status(201).send({ tripId: trip.id });
    }
  );
}

export {
  createTrips
};
