import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodTypeAny } from 'zod';

export const validationMiddleware = (schema: ZodTypeAny) => async (request: FastifyRequest, reply: FastifyReply) => {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    return reply.code(400).send({ message: 'Validation error', errors: result.error.issues });
  }
};
