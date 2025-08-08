import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContract } from "../hooks/use-contract";
import { Cl } from '@stacks/transactions';
import { cvToValue } from '@stacks/transactions';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Wallet, 
  ThumbsUp, 
  ThumbsDown,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/Navbar";

const CampaignDetails = () => {
  const { id } = useParams();
  const [contributionAmount, setContributionAmount] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { callContract, readContract } = useContract();

  // Load campaign data from blockchain
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true);
        const campaignResult = await readContract('get_campaign', [Cl.uint(parseInt(id))]);
        
        if (campaignResult.type === 'ok') {
          const campaignData = cvToValue(campaignResult.value);
          console.log('Campaign data:', campaignData);
          setCampaign(campaignData);
        } else {
          setError('Campaign not found');
        }
      } catch (err) {
        console.error('Error loading campaign:', err);
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCampaign();
    }
  }, [id, readContract]);

  // Mock campaign data for fallback - in real app, this would come from blockchain/API
  const mockCampaign = {
    id: "1",
    title: "Decentralized Social Media Platform",
    description: "Building a censorship-resistant social network powered by blockchain technology that gives users full control over their data and content. Our platform will feature decentralized identity management, encrypted messaging, and community governance mechanisms.",
    goal: 50000,
    raised: 32500,
    backers: 127,
    endDate: "2024-07-15",
    category: "Technology",
    status: "funding",
    creator: "0x123...abc",
    proposalLink: "https://github.com/example/proposal",
    milestones: [
      {
        id: 1,
        title: "Platform Architecture & Design",
        description: "Complete system architecture design and UI/UX mockups",
        amount: 12500,
        status: "completed",
        votesFor: 89,
        votesAgainst: 3,
        completedAt: "2024-01-15"
      },
      {
        id: 2,
        title: "Core Backend Development",
        description: "Develop user authentication, posting system, and basic API endpoints",
        amount: 15000,
        status: "completed",
        votesFor: 94,
        votesAgainst: 1,
        completedAt: "2024-03-20"
      },
      {
        id: 3,
        title: "Frontend Implementation",
        description: "Build responsive web application with real-time features",
        amount: 12500,
        status: "voting",
        votesFor: 45,
        votesAgainst: 8,
        voteDeadline: "2024-06-20"
      },
      {
        id: 4,
        title: "Testing & Launch",
        description: "Comprehensive testing, security audit, and mainnet deployment",
        amount: 10000,
        status: "pending",
        votesFor: 0,
        votesAgainst: 0
      }
    ]
  };

  // Use real campaign data if available, otherwise use mock data
  const displayCampaign = campaign || mockCampaign;
  const progressPercentage = (displayCampaign.amount_raised || displayCampaign.raised) / (displayCampaign.goal) * 100;
  
  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="pt-24 px-4 pb-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-verifund-light-accent text-xl">Loading campaign...</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="pt-24 px-4 pb-16">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-red-400 text-xl">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const handleContribute = async () => {
    try {
      console.log(`Contributing ${contributionAmount} STX to campaign ${id}`);
      const amount = parseFloat(contributionAmount) * 1000000; // Convert to microSTX
      
      const response = await callContract({
        functionName: 'fund_campaign',
        functionArgs: [
          Cl.uint(parseInt(id)),
          Cl.uint(amount)
        ]
      });
      
      console.log('Contribution successful:', response);
      alert('Contribution successful!');
      setContributionAmount('');
      // Reload campaign data
      window.location.reload();
    } catch (error) {
      console.error('Contribution failed:', error);
      alert('Contribution failed. Please try again.');
    }
  };

  const handleVote = async (milestoneIndex: number, vote: 'for' | 'against') => {
    try {
      console.log(`Voting ${vote} for milestone ${milestoneIndex}`);
      
      const response = await callContract({
        functionName: 'approve-milestone',
        functionArgs: [
          Cl.uint(parseInt(id)),
          Cl.uint(milestoneIndex),
          Cl.stringAscii(vote)
        ]
      });
      
      console.log('Vote successful:', response);
      alert('Vote submitted successfully!');
      // Reload campaign data
      window.location.reload();
    } catch (error) {
      console.error('Vote failed:', error);
      alert('Vote failed. Please make sure you are a funder and haven\'t voted yet.');
    }
  };

  const handleStartVoting = async (milestoneIndex: number) => {
    try {
      console.log(`Starting voting for milestone ${milestoneIndex}`);
      
      const response = await callContract({
        functionName: 'start_milestone_voting',
        functionArgs: [
          Cl.uint(parseInt(id)),
          Cl.uint(milestoneIndex)
        ]
      });
      
      console.log('Voting started:', response);
      alert('Milestone voting started!');
      // Reload campaign data
      window.location.reload();
    } catch (error) {
      console.error('Failed to start voting:', error);
      alert('Failed to start voting. Make sure you are the campaign owner.');
    }
  };

  const handleWithdraw = async (milestoneIndex: number) => {
    try {
      console.log(`Withdrawing milestone ${milestoneIndex} funds`);
      
      const response = await callContract({
        functionName: 'withdraw-milestone-reward',
        functionArgs: [
          Cl.uint(parseInt(id)),
          Cl.uint(milestoneIndex)
        ]
      });
      
      console.log('Withdrawal successful:', response);
      alert('Milestone funds withdrawn successfully!');
      // Reload campaign data
      window.location.reload();
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert('Withdrawal failed. Make sure the milestone has enough approvals.');
    }
  };

  const handleRefund = async () => {
    try {
      console.log(`Requesting refund for campaign ${id}`);
      
      const response = await callContract({
        functionName: 'request_refund',
        functionArgs: [
          Cl.uint(parseInt(id))
        ]
      });
      
      console.log('Refund successful:', response);
      alert('Refund processed successfully!');
      // Reload campaign data
      window.location.reload();
    } catch (error) {
      console.error('Refund failed:', error);
      alert('Refund failed. Refunds are only available for cancelled campaigns.');
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Header */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-verifund-mid-tone border-verifund-mid-tone">
                      {displayCampaign.category || 'Technology'}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {displayCampaign.status || 'Funding'}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl text-verifund-light-accent mb-4">
                    {displayCampaign.name || displayCampaign.title}
                  </CardTitle>
                  <p className="text-verifund-neutral-gray text-lg leading-relaxed">
                    {displayCampaign.description}
                  </p>
                  
                  {(displayCampaign.proposal_link || displayCampaign.proposalLink) && (
                    <div className="pt-4">
                      <a 
                        href={displayCampaign.proposal_link || displayCampaign.proposalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-verifund-mid-tone hover:text-verifund-light-accent transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Detailed Proposal
                      </a>
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Campaign Tabs */}
              <Tabs defaultValue="milestones" className="space-y-6">
                <TabsList className="bg-verifund-secondary-dark border border-verifund-accent-dark">
                  <TabsTrigger value="milestones" className="data-[state=active]:bg-verifund-accent-dark">
                    Milestones
                  </TabsTrigger>
                  <TabsTrigger value="updates" className="data-[state=active]:bg-verifund-accent-dark">
                    Updates
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="data-[state=active]:bg-verifund-accent-dark">
                    Comments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="milestones" className="space-y-4">
                  {(displayCampaign.milestones || []).map((milestone, index) => (
                    <Card key={milestone.id} className="glass-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              milestone.status === 'voting' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-verifund-neutral-gray/20 text-verifund-neutral-gray'
                            }`}>
                              {milestone.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : index + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-verifund-light-accent">
                                {milestone.name || milestone.title}
                              </h3>
                              <p className="text-verifund-neutral-gray text-sm">
                                ${(milestone.amount || 0).toLocaleString()} STX
                              </p>
                            </div>
                          </div>
                          
                          <Badge className={
                            milestone.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            milestone.status === 'voting' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                            'bg-verifund-neutral-gray/20 text-verifund-neutral-gray border-verifund-neutral-gray/30'
                          }>
                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-verifund-neutral-gray mb-4">
                          {milestone.description}
                        </p>
                        
                        {/* Campaign owner actions */}
                        {milestone.status === 'pending' && (
                          <div className="mb-4">
                            <Button 
                              onClick={() => handleStartVoting(index)}
                              className="btn-primary"
                            >
                              Start Voting
                            </Button>
                          </div>
                        )}
                        
                        {milestone.status === 'voting' && displayCampaign.owner && (
                          <div className="mb-4">
                            <Button 
                              onClick={() => handleWithdraw(index)}
                              className="btn-primary"
                            >
                              Withdraw Funds
                            </Button>
                          </div>
                        )}
                        
                        {milestone.status === 'voting' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-verifund-neutral-gray">Voting ends:</span>
                              <span className="text-verifund-light-accent">{milestone.voteDeadline}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-400">For: {milestone.votes_for || milestone.votesFor || 0}</span>
                                  <span className="text-red-400">Against: {milestone.votes_against || milestone.votesAgainst || 0}</span>
                                </div>
                                <Progress 
                                  value={((milestone.votes_for || milestone.votesFor || 0) / Math.max(1, (milestone.votes_for || milestone.votesFor || 0) + (milestone.votes_against || milestone.votesAgainst || 0))) * 100} 
                                  className="h-2"
                                />
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  className="btn-primary flex-1"
                                  onClick={() => handleVote(index, 'for')}
                                >
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="btn-secondary flex-1"
                                  onClick={() => handleVote(index, 'against')}
                                >
                                  <ThumbsDown className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {milestone.status === 'completed' && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-400">
                              ✓ Completed on {milestone.completedAt || milestone.completion_date || 'Recently'}
                            </span>
                            <span className="text-verifund-neutral-gray">
                              {milestone.votes_for || milestone.votesFor || 0} for, {milestone.votes_against || milestone.votesAgainst || 0} against
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="updates">
                  <Card className="glass-card">
                    <CardContent className="p-8 text-center">
                      <Clock className="w-12 h-12 text-verifund-neutral-gray mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-verifund-light-accent mb-2">No updates yet</h3>
                      <p className="text-verifund-neutral-gray">
                        The creator hasn't posted any updates for this campaign yet.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comments">
                  <Card className="glass-card">
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 text-verifund-neutral-gray mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-verifund-light-accent mb-2">No comments yet</h3>
                      <p className="text-verifund-neutral-gray">
                        Be the first to share your thoughts about this campaign.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Progress */}
              <Card className="glass-card">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-verifund-light-accent mb-2">
                      ${((displayCampaign.amount_raised || displayCampaign.raised || 0) / 1000000).toLocaleString()} STX
                    </h3>
                    <p className="text-verifund-neutral-gray">
                      raised of ${(displayCampaign.goal / 1000000).toLocaleString()} STX goal
                    </p>
                  </div>
                  
                  <Progress value={progressPercentage} className="h-3" />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-verifund-light-accent">{displayCampaign.backers || 0}</p>
                      <p className="text-verifund-neutral-gray text-sm">backers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-verifund-light-accent">{displayCampaign.status || 'Active'}</p>
                      <p className="text-verifund-neutral-gray text-sm">status</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="Amount in STX"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="bg-verifund-primary-dark border-verifund-accent-dark text-verifund-light-accent"
                    />
                    <Button 
                      className="btn-primary w-full"
                      onClick={handleContribute}
                      disabled={!contributionAmount}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Back This Project
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-verifund-accent-dark/30">
                    <Button 
                      variant="outline" 
                      className="btn-secondary w-full"
                      onClick={handleRefund}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Request Refund
                    </Button>
                    <p className="text-xs text-verifund-neutral-gray mt-2 text-center">
                      Only available if milestones aren't met
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Creator */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-verifund-light-accent text-lg">Campaign Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-verifund-accent-dark to-verifund-mid-tone rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">0x</span>
                    </div>
                    <div>
                      <p className="text-verifund-light-accent font-medium">{displayCampaign.owner || displayCampaign.creator || 'Unknown'}</p>
                      <p className="text-verifund-neutral-gray text-sm">Campaign Creator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Backers */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-verifund-light-accent text-lg">Recent Backers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-verifund-mid-tone rounded-full"></div>
                        <span className="text-verifund-light-accent text-sm">0x{i}23...abc</span>
                      </div>
                      <span className="text-verifund-neutral-gray text-sm">
                        {100 * i} STX
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;