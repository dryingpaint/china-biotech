export type CompanyCategory =
  | "pharma"
  | "mnc_pharma"
  | "platform"
  | "investor"
  | "academic"
  | "hospital"
  | "regulator"
  | "exchange";

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
  biggestDeal?: CompanyDeal;
};

export type ProductClass = {
  name: string;
  modality?: ModalityKey;
  status?: "approved" | "phase3" | "phase2" | "phase1" | "preclinical";
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
  subcategory?: string;
  modalities?: ModalityKey[];
  productClasses?: ProductClass[];
  therapeuticAreas?: string[];
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

export type TrialStartsShare = {
  china: number;
  us: number;
  eu: number;
  japan: number;
  row: number;
};

export type ChapterMetrics = {
  pipelineSharePct: number;
  inLicensingSharePct: number;
  trialStartsShare: TrialStartsShare;
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
