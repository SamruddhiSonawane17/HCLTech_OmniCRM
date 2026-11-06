export type DealStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Deal {
  id: string;
  customer: string;
  title: string;
  value: number;
  owner: string;
  closeDate: string;
  stage: DealStage;
}
