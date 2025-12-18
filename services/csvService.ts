
import Papa from 'papaparse';
import { AdData, IngestionReport } from '../types';

const detectProduct = (campaignName: string): string => {
  const name = campaignName.toUpperCase();
  // Lista estrita de produtos conhecidos
  if (name.includes('CBAS')) return 'CBAS';
  if (name.includes('IBFC')) return 'IBFC';
  if (name.includes('CATARSE')) return 'CATARSE';
  if (name.includes('SSPC')) return 'SSPC';
  
  // Nome solicitado pelo usuário para campanhas não identificadas
  return 'POSTS TURBINADOS';
};

const sanitizeUrl = (url: any): string => {
  if (!url || typeof url !== 'string') return '';
  return url.trim();
};

export const parseAdsCSV = (file: File): Promise<{ data: AdData[]; report: IngestionReport }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const rawData = results.data as any[];
        const validRows: AdData[] = [];
        let minDate = '';
        let maxDate = '';

        rawData.forEach((row) => {
          const date = row['Date'];
          if (!date) return;

          const campaignName = String(row['Campaign Name'] || '');
          const impressions = Number(row['Impressions']) || 0;
          const linkClicks = Number(row['Action Link Clicks']) || 0;
          const spend = Number(row['Spend (Cost, Amount Spent)']) || 0;

          if (!minDate || date < minDate) minDate = date;
          if (!maxDate || date > maxDate) maxDate = date;

          validRows.push({
            date: String(date),
            product: detectProduct(campaignName),
            accountName: String(row['Account Name'] || ''),
            campaignName,
            adSetName: String(row['Adset Name'] || ''),
            adName: String(row['Ad Name'] || ''),
            spend,
            impressions,
            reach: Number(row['Reach (Estimated)']) || 0,
            linkClicks,
            lpv: Number(row['Action Landing Page View']) || 0,
            leads: Number(row['Action Leads']) || 0,
            costPerLead: Number(row['Cost Per Action Leads']) || 0,
            purchases: Number(row['Action Omni Purchase']) || 0,
            costPerPurchase: Number(row['Cost Per Action Omni Purchase']) || 0,
            conversations: Number(row['Action Messaging Conversations Started (Onsite Conversion)']) || 0,
            costPerConversation: Number(row['Cost Per Action Messaging Conversations Started (Onsite Conversion)']) || 0,
            ctrMeta: Number(row['CTR (Clickthrough Rate)']) || 0,
            ctrNormalized: impressions > 0 ? (linkClicks / impressions) * 100 : 0,
            engagementRanking: String(row['Engagement Rate Ranking'] || 'UNKNOWN'),
            thumbnailUrl: sanitizeUrl(row['Thumbnail URL']),
            permalink: sanitizeUrl(row['Instagram Permalink URL']),
            comments: Number(row['Action Post Comments']) || 0,
            engagement: Number(row['Action Post Engagement']) || 0,
            reactions: Number(row['Action Post Reactions']) || 0,
            shares: Number(row['Action Post Shares']) || 0,
            saves: Number(row['Action Post Save (Onsite Conversion)']) || 0,
            thruplays: Number(row['Video Thruplay Watched Actions']) || 0,
            plays: Number(row['Video Play Actions']) || 0,
            video95: Number(row['Video 95 Percent Watched Actions']) || 0,
            retentionRate: 0,
            engagementRate: 0
          });
        });

        resolve({ data: validRows, report: { totalRows: rawData.length, validRows: validRows.length, dateRange: [minDate, maxDate], missingColumns: [], extraColumns: [] } });
      },
      error: reject,
    });
  });
};
