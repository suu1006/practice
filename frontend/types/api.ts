export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CreditReportSummary = {
  id: number;
  title: string;
  agencyName: string;
  creditScore: number;
  creditGrade: number;
  issuedAt: string;
};

export type CreditReportDetail = CreditReportSummary & {
  maskedResidentRegistrationNumber: string;
  summary: string;
};
