import { FastifyPluginAsync } from 'fastify';

const policyRoutes: FastifyPluginAsync = async (app) => {
  app.get('/policy/financial', async () => ({
    code: 'POLICY_REF',
    title: 'Financial Integrity & Acceptable Use Policy',
    version: '1.0',
    effectiveDate: '2026-05-02',
    path: 'docs/policies/FINANCIAL_POLICY.md'
  }));
};

export default policyRoutes;
