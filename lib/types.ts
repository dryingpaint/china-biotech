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
  sources?: string[];
};

export type Reform = {
  id: string;
  name: string;
  nameZh?: string;
  date: string;
  effectiveDate?: string;
  agency?: string;
  documentRef?: string;
  category: ReformCategory;
  shortDescription: string;
  impact: string;
  keyProvisions?: string[];
  narrativeHook?: string;
  affectedCompanyIds?: string[];
  sources?: string[];
  verified?: boolean;
  lastVerified?: string;
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

export type ModalityKey =
  | "smallMol"
  | "peptide"
  | "recombinant"
  | "biosimilar"
  | "novelMab"
  | "bispecific"
  | "adc"
  | "vaccine"
  | "cellTherapy"
  | "nucleicAcid"
  | "geneTherapy"
  | "radiopharm";

export type ModalityRungState = {
  rung: 0 | 1 | 2 | 3 | 4 | 5;
  marker?: string;
  frontier?: boolean;
};

export type ModalityProgress = Record<ModalityKey, ModalityRungState>;

export type Chapter = {
  id: string;
  title: string;
  date: string;
  body: string;
  metrics: ChapterMetrics;
  activeCompanyIds: string[];
  activeReformIds: string[];
  modalityProgress?: ModalityProgress;
  featureChart?: string;
};

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroByline: string;
};
