export type CompanyCategory =
  | "innovator"
  | "cro_cdmo"
  | "vaccines"
  | "genomics"
  | "traditional"
  | "adc"
  | "cell_gene"
  | "mrna";

export type ReformCategory =
  | "approval"
  | "market_access"
  | "capital_markets"
  | "geopolitical";

export type Company = {
  id: string;
  name: string;
  founded: number;
  category: CompanyCategory;
  shortDescription: string;
  signature: string;
  milestones?: { year: number; label: string }[];
};

export type Reform = {
  id: string;
  name: string;
  date: string;
  category: ReformCategory;
  shortDescription: string;
  impact: string;
};

export type ChapterMetrics = {
  novelDrugApprovals: number;
  licenseInDeals: number;
  licenseOutDeals: number;
  apiGlobalShare: number;
  biotechIPOs: number;
  rdSpendBillions: number;
  globalClinicalTrialShare: number;
};

export type Chapter = {
  id: string;
  title: string;
  date: string;
  metrics: ChapterMetrics;
  activeCompanyIds: string[];
  activeReformIds: string[];
  featureChart?: string;
};
