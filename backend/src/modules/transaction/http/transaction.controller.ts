import { FastifyRequest } from 'fastify';
import { TransactionService } from '../application/transaction.service.js';

const service = new TransactionService();

export const createTransactionController = async (request: FastifyRequest) => {
  const body = request.body as { fromFamilyId: string; toFamilyId: string; amount: number };
  return service.create(body);
};
