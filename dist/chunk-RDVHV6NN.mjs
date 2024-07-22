import {
  deleteTrip
} from "./chunk-LMMKJWNL.mjs";
import {
  getTripDetails
} from "./chunk-AWBDWNUZ.mjs";
import {
  updateTrips
} from "./chunk-KYIIOWMH.mjs";
import {
  getLinks
} from "./chunk-RZE3VHZN.mjs";
import {
  comfirmParticipant
} from "./chunk-YUTMFS3Z.mjs";
import {
  createInvite
} from "./chunk-VF7KARCR.mjs";
import {
  deleteParticipant
} from "./chunk-S7CNX4UQ.mjs";
import {
  getParticipant
} from "./chunk-SMI5PSSS.mjs";
import {
  getParticipants
} from "./chunk-XWIAQM7U.mjs";
import {
  comfirmTrips
} from "./chunk-EGU4TKFG.mjs";
import {
  createTrips
} from "./chunk-HMXRARJ6.mjs";
import {
  createActivity
} from "./chunk-5XDKDS5W.mjs";
import {
  deleteActivities
} from "./chunk-ZYHV63U7.mjs";
import {
  getActivity
} from "./chunk-IXZLSXBT.mjs";
import {
  createLink
} from "./chunk-G5SVMEFF.mjs";
import {
  deleteLink
} from "./chunk-RDO7HPOF.mjs";
import {
  errorHandler
} from "./chunk-5ZYBF6V3.mjs";

// src/app.ts
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
var app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Plan.ner API",
      description: "Plan.ner \xE9 uma API para gerenciamento de viagens.",
      version: "0.1.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.register(fastifyCors, {
  origin: "*"
});
app.setErrorHandler(errorHandler);
app.register(createTrips);
app.register(comfirmTrips);
app.register(updateTrips);
app.register(getTripDetails);
app.register(deleteTrip);
app.register(comfirmParticipant);
app.register(createInvite);
app.register(getParticipants);
app.register(getParticipant);
app.register(deleteParticipant);
app.register(createLink);
app.register(getLinks);
app.register(deleteLink);
app.register(createActivity);
app.register(getActivity);
app.register(deleteActivities);

export {
  app
};
