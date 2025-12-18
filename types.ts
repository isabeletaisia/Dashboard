
export interface AdData {
  date: string;
  product: string; // Novo campo extraído da campanha
  accountName: string;
  campaignName: string;
  adSetName: string;
  adName: string;
  spend: number;
  impressions: number;
  reach: number;
  linkClicks: number;
  lpv: number;
  leads: number;
  costPerLead: number;
  purchases: number;
  costPerPurchase: number;
  conversations: number;
  costPerConversation: number;
  ctrMeta: number;
  ctrNormalized: number;
  engagementRanking: string;
  thumbnailUrl: string;
  permalink: string;
  comments: number;
  engagement: number;
  reactions: number;
  shares: number;
  saves: number;
  thruplays: number;
  plays: number;
  video95: number;
  retentionRate: number;
  engagementRate: number;
}

export type DatePreset = '7d' | '14d' | '30d' | 'mtd' | 'all';

export interface Filters {
  datePreset: DatePreset;
  dateRange: [Date | null, Date | null];
  resultType: 'leads' | 'purchases' | 'conversations';
  selectedProduct: string; // Ex: CBAS, IBFC
  selectedCampaign: string;
  selectedAdSet: string;
  selectedAd: string;
}

export interface IngestionReport {
  totalRows: number;
  validRows: number;
  dateRange: [string, string];
  missingColumns: string[];
  extraColumns: string[];
}
