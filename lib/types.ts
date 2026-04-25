export type CompanyCategory =
  | "innovator"
  | "cro_cdmo"
  | "vaccines"
  | "genomics"
  | "traditional"
  | "adc"
  | "cell_gene"
  | "mrna"
  | "ai_bio";

export type ReformCategory =
  | "approval"
  | "market_access"
  | "capital_markets"
  | "geopolitical";

export type LeadAsset = {
  name: string;
  mechanism?: string;
  indication?: string;
  status?: string;
};

export type CompanyDeal = {
  partner: string;
  type: "license-in" | "license-out" | "acquisition" | "collaboration";
  year: number;
  valueBillions?: number;
};

export type CompanyTodaySnapshot = {
  asOf: string;
  marketCapBillions?: number;
  revenueBillions?: number;
  revenueYear?: number;
  approvedDrugCount?: number;
  listings?: string[];
  leadAsset?: LeadAsset;
  modalities?: string[];
  biggestDeal?: CompanyDeal;
};

export type CompanyTimelineEntry = {
  chapterId: string;
  status?: string;
  approvedDrugCount?: number;
  pipelineStage?: string;
  listings?: string[];
  note?: string;
};

export type Source = {
  title: string;
  publisher?: string;
  url: string;
  accessedDate?: string;
};

export type Company = {
  id: string;
  name: string;
  nameZh?: string;
  founded: number;
  headquarters?: string;
  founders?: string;
  category: CompanyCategory;
  shortDescription: string;
  signature: string;
  narrativeHook?: string;
  verified?: boolean;
  lastVerified?: string;
  today?: CompanyTodaySnapshot;
  timeline?: CompanyTimelineEntry[];
  milestones?: { year: number; label: string }[];
  sources?: Source[];
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
  body: string;
  metrics: ChapterMetrics;
  activeCompanyIds: string[];
  activeReformIds: string[];
  featureChart?: string;
};

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroByline: string;
};
