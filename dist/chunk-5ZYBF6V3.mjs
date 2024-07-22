import {
  ClientError
} from "./chunk-YUBR4ZE2.mjs";

// src/erros/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "invalid input",
      erros: error.flatten().fieldErrors
    });
  }
  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message
    });
  }
  return reply.status(500).send({ message: "Internal server error" });
};

export {
  errorHandler
};
