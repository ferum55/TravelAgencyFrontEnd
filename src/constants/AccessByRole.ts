export const accessByRole={
    TourManager: ['Tours','TourOffers'],
    ClientManager: ['ClientInfo'],
    InsuranceManager:['Insurance']
} as const
export type Role=keyof typeof accessByRole;
