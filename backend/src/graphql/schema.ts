export const typeDefs = `
  type Health { status: String!, name: String! }
  type FamilyBalance { familyId: ID!, netBalance: Float! }
  type EventSummary { id: ID!, title: String!, status: String! }

  type Query {
    health: Health!
    familyBalance(familyId: ID!): FamilyBalance!
    eventSummary(eventId: ID!): EventSummary!
  }

  type Mutation {
    createPayment(familyId: ID!, amount: Float!): String!
    createTransaction(fromFamilyId: ID!, toFamilyId: ID!, amount: Float!): String!
    settleEvent(eventId: ID!): String!
  }
`;

export const resolvers = {
  Query: {
    health: () => ({ status: 'ok', name: 'GramFund API' }),
    familyBalance: ({ familyId }: { familyId: string }) => ({ familyId, netBalance: 0 }),
    eventSummary: ({ eventId }: { eventId: string }) => ({ id: eventId, title: 'Pending', status: 'DRAFT' })
  },
  Mutation: {
    createPayment: () => 'queued',
    createTransaction: () => 'queued',
    settleEvent: () => 'queued'
  }
};
