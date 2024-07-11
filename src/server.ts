import fastify from "fastify";
import { createTrips } from "./routes/create_trips";
import {
   serializerCompiler,
   validatorCompiler,
} from "fastify-type-provider-zod";
import { comfirmTrips } from "./routes/confirm_trip";
import fastifyCors from "@fastify/cors";
import { comfirmParticipant } from "./routes/confirm_participant";
import { createActivity } from "./routes/create_activity";
import { getActivity } from "./routes/get_activities";
import { createLink } from "./routes/create_link";
import { getLinks } from "./routes/get_links";
import { getParticipants } from "./routes/get_participants";
import { createInvite } from "./routes/create_invite";
import { updateTrips } from "./routes/update_trip";
import { getTripDetails } from "./routes/get_trip_details";
import { getParticipant } from "./routes/get_participant";
import { errorHandler } from "./erros/error-handler";
import { env } from "./env";

// exportar app com o fastify
const app = fastify();

// configurar CORS
app.register(fastifyCors, {
   origin: "*",
});

app.setErrorHandler(errorHandler);

// configurar o validatorCompiler e serializerCompiler
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// registrar as rotas
app.register(createTrips);
app.register(comfirmTrips);
app.register(comfirmParticipant);
app.register(createActivity);
app.register(getActivity);
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(updateTrips);
app.register(getTripDetails);
app.register(getParticipant);

// iniciar o servidor
app.listen({ port: env.PORT }).then(() => {
   console.log("Server running on port 3333");
});
