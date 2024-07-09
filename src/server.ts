import fastify from "fastify";
import { createTrips } from "./routes/create_trips";
import {
   serializerCompiler,
   validatorCompiler,
} from "fastify-type-provider-zod";
import { comfirmTrips } from "./routes/confirm_trip";
import fastifyCors from "@fastify/cors";

// exportar app com o fastify
const app = fastify();

// configurar CORS
app.register(fastifyCors, {
   origin: "*",
});

// configurar o validatorCompiler e serializerCompiler
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// registrar as rotas
app.register(createTrips);
app.register(comfirmTrips);

// iniciar o servidor
app.listen({ port: 3333 }).then(() => {
   console.log("Server running on port 3333");
});
