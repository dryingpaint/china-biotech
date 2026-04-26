export type EntityCategory =
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

export type LeadAsset = {
  name: string;
  mechanism?: string;
  indication?: string;
  status?: string;
};

export type Deal = {
  partner: string;
  type: "license-in" | "license-out" | "acquisition" | "collaboration";
  year: number;
  valueBillions?: number;
};

export type ProductClass = {
  name: string;
  modality?: ModalityKey;
  status?: "approved" | "phase3" | "phase2" | "phase1" | "preclinical";
};

// Pharma + platform "today" snapshot. Other categories have their own context blocks.
export type PharmaSnapshot = {
  asOf: string;
  marketCapBillions?: number;
  revenueBillions?: number;
  revenueYear?: number;
  approvedDrugCount?: number;
  listings?: string[];
  leadAsset?: LeadAsset;
  biggestDeal?: Deal;
};

export type EntityTimelineEntry = {
  chapterId: string;
  status?: string;
  approvedDrugCount?: number;
  pipelineStage?: string;
  listings?: string[];
  note?: string;
};

// ---- per-category context blocks ----

export type MncDeal = {
  partner: string; // entity id of Chinese counterparty when available, else company name
  year: number;
  asset?: string;
  type?: "license-in" | "license-out" | "equity" | "acquisition" | "collaboration";
  valueBillions?: number;
  status?: string;
};

export type MncContext = {
  chinaArrival?: string; // year + form, e.g. "Beijing R&D centre 2013"
  chinaHeadcount?: number;
  chinaRevenueBillions?: number;
  chinaRevenueYear?: number;
  notableDeals?: MncDeal[];
  hookFact?: string;
};

export type RegulatorContext = {
  parent?: string;
  mandate?: string;
  currentLeader?: string;
  keyReformIds?: string[]; // ids in data/reforms.json
  hookFact?: string;
};

export type AcademicPI = {
  name: string;
  lab?: string;
  area?: string;
};

export type AcademicContext = {
  affiliation?: string;
  keyPIs?: AcademicPI[];
  spinoutEntityIds?: string[]; // entity ids
  hookFact?: string;
};

export type InvestorExit = {
  entityId: string;
  role?: string; // e.g. "anchor IPO investor"
  year?: number;
};

export type InvestorContext = {
  aumBillions?: number;
  biotechFocus?: "biotech-dedicated" | "diversified";
  notableExits?: InvestorExit[];
  hookFact?: string;
};

export type HospitalTrial = {
  trial: string;
  sponsor?: string;
  asset?: string;
  role?: string;
};

export type HospitalContext = {
  affiliation?: string;
  beds?: number;
  keyTrials?: HospitalTrial[];
  hookFact?: string;
};

export type FlagshipListing = {
  entityId: string;
  year: number;
  raiseBillions?: number;
};

export type ExchangeContext = {
  keyRule?: string; // e.g. "Chapter 18A (2018)"
  biotechListings?: number;
  cumulativeRaiseBillions?: number;
  raisesSinceYear?: number;
  flagshipListings?: FlagshipListing[];
  hookFact?: string;
};

// ---- entity types ----

export type Entity = {
  id: string;
  name: string;
  nameZh?: string;
  founded?: number;
  headquarters?: string;
  founders?: string;
  category: EntityCategory;
  subcategory?: string;
  shortDescription: string;
  signature?: string;
  narrativeHook?: string;
  verified?: boolean;
  lastVerified?: string;
  timeline?: EntityTimelineEntry[];
  milestones?: { year: number; label: string }[];
  sources?: string[];

  // pharma + platform fields
  modalities?: ModalityKey[];
  productClasses?: ProductClass[];
  therapeuticAreas?: string[];
  today?: PharmaSnapshot;

  // category-specific context (only one populated, keyed by category)
  mncContext?: MncContext;
  regulatorContext?: RegulatorContext;
  academicContext?: AcademicContext;
  investorContext?: InvestorContext;
  hospitalContext?: HospitalContext;
  exchangeContext?: ExchangeContext;
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
  affectedEntityIds?: string[];
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

export type Chapter = {
  id: string;
  title: string;
  date: string;
  body: string;
  metrics: ChapterMetrics;
  activeEntityIds: string[];
  activeReformIds: string[];
  modalityProgress?: ModalityProgress;
  featureChart?: string;
};

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroByline: string;
};

export type DeepDive = {
  id: string;
  title: string;
  body: string;
};
