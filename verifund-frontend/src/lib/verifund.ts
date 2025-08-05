

export type CampaignDetails = {
    name: string;
    description: string;
    goal: number;
    amount_raised: number;
    balance: number;
    owner: string;
    milestones: [{
        name: string;
        description: string;
        amount: number;
    }]
    proposal_link: string;
}