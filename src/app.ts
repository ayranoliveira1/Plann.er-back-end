import fastify from "fastify";
import { errorHandler } from "./erros/error-handler";
import fastifyCors from "@fastify/cors";
import {
   jsonSchemaTransform,
   serializerCompiler,
   validatorCompiler,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { createTrips } from "./routes/trip/create_trips";
import { comfirmTrips } from "./routes/trip/confirm_trip";
import { comfirmParticipant } from "./routes/participant/confirm_participant";
import { createActivity } from "./routes/activity/create_activity";
import { getActivity } from "./routes/activity/get_activities";
import { createLink } from "./routes/link/create_link";
import { getLinks } from "./routes/link/get_links";
import { getParticipants } from "./routes/participant/get_participants";
import { createInvite } from "./routes/participant/create_invite";
import { updateTrips } from "./routes/trip/update_trip";
import { getTripDetails } from "./routes/trip/get_trip_details";
import { getParticipant } from "./routes/participant/get_participant";
import { deleteActivities } from "./routes/activity/delete_activities";
import { deleteLink } from "./routes/link/delete-links";
import { deleteTrip } from "./routes/trip/delete_trip";
import { deleteParticipant } from "./routes/participant/delete_participant";

const app = fastify();

// configurar o validatorCompiler e serializerCompiler
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//configurar o Swagger
app.register(fastifySwagger, {
   swagger: {
      consumes: ["application/json"],
      produces: ["application/json"],
      info: {
         title: "Plan.ner API",
         description: "Plan.ner é uma API para gerenciamento de viagens.",
         version: "0.1.0",
      },
   },

   transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
   routePrefix: "/docs",
});

// configurar CORS
app.register(fastifyCors, {
   origin: "*",
});

// configurar o errorHandler
app.setErrorHandler(errorHandler);

// rotas de viagem
app.register(createTrips);
app.register(comfirmTrips);
app.register(updateTrips);
app.register(getTripDetails);
app.register(deleteTrip);

// rotas de participante
app.register(comfirmParticipant);
app.register(createInvite);
app.register(getParticipants);
app.register(getParticipant);
app.register(deleteParticipant);

// rotas de link
app.register(createLink);
app.register(getLinks);
app.register(deleteLink);

// rotas de atividade
app.register(createActivity);
app.register(getActivity);
app.register(deleteActivities);

export { app };
