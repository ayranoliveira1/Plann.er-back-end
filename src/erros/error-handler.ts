import { FastifyInstance } from "fastify";
import { ClientError } from "./clientError";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
   if (error instanceof ZodError) {
      return reply.status(400).send({
         message: "invalid input",
         erros: error.flatten().fieldErrors,
      });
   }

   if (error instanceof ClientError) {
      return reply.status(400).send({
         message: error.message,
      });
   }

   return reply.status(500).send({ message: "Internal server error" });
};
