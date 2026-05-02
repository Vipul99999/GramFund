import { FastifyPluginAsync } from 'fastify';
import { createTransactionController } from './transaction.controller.js';
import { validationMiddleware } from '../../../middleware/validation.middleware.js';
import { createTransactionSchema } from './transaction.validation.js';
import { authorize } from '../../../middleware/authorize.middleware.js';

const transactionRoutes: FastifyPluginAsync = async (app) => {
  app.post('/transactions', {
    preHandler: [
      validationMiddleware(createTransactionSchema),
      authorize('transaction.create')
    ]
  }, createTransactionController);
};

export default transactionRoutes;
