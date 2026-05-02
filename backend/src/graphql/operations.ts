export const graphqlOperations = {
  queries: {
    familyDashboard: {
      purpose: 'Single-call family home screen',
      fields: ['family', 'balance', 'events', 'recentTransactions'],
      replacesRest: ['/families/:id', '/families/:id/balance', '/families/:id/events', '/families/:id/transactions']
    },
    handlerDashboard: {
      purpose: 'Single-call handler workspace',
      fields: ['handler', 'commission', 'families', 'events', 'performance', 'recentCollections'],
      replacesRest: ['/handlers/:id', '/handlers/:id/performance', '/handlers/:id/families', '/handlers/:id/transactions']
    },
    eventFinance: {
      purpose: 'Single-call event finance view',
      fields: ['event', 'participants', 'payments', 'transactions', 'ledger'],
      replacesRest: ['/events/:id', '/events/:id/participants', '/events/:id/payments', '/events/:id/transactions', '/events/:id/ledger']
    },
    adminOverview: {
      purpose: 'Single-call admin analytics panel',
      fields: ['summary', 'topContributors', 'defaulters', 'collection', 'balanceSheet'],
      replacesRest: ['/reports/summary', '/reports/top-contributors', '/reports/defaulters', '/reports/collection', '/reports/balance-sheet']
    }
  },
  mutations: {
    createPayment: { keepRest: true, restEndpoint: '/payments' },
    confirmPayment: { keepRest: true, restEndpoint: '/payments/:id/confirm' },
    reverseTransaction: { keepRest: true, restEndpoint: '/transactions/:id/reverse' }
  }
} as const;
