export interface PurchaseDto {
  tourPurchaseId: number;
  purchaseNumber: string;
  purchaseDate: string;
  statusId: number;
  status: string;
  price: number;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  tourId: number
  insuranceId: number

  // нові поля для страхування
  insuranceType: string;           // Insurance.InsuranceType
  paymentAmount: number;           // Insurance.PaymentAmount
  coverageAmount: number;          // Insurance.CoverageAmount
  insuranceCompanyName: string;    // Insurance.InsuranceCompany.Name

  // список покритих ризиків
  coveredRisks: string[];          // Insurance.InsuranceRisks.Select(r=>r.Risk.Type)
}

export interface ClientCardDto {
  clientId: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  phoneNumber: string;
  email: string;
  purchases: PurchaseDto[];
}
