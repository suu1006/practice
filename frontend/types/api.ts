export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CreditReportSummary = {
  id: string;
  title: string;
  agencyName: string;
  creditScore: number;
  creditGrade: number;
  issuedAt: string;
};
