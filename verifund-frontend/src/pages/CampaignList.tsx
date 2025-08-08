import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import CampaignCard from "@/components/CampaignCard";
import { useContract } from "../hooks/use-contract";
import { Cl, cvToValue } from '@stacks/transactions';

const CampaignList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { readContract } = useContract();

  // Load campaigns from blockchain
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        
        // Get total campaign count first
        const countResult = await readContract('get_campaign_count');
        const totalCampaigns = cvToValue(countResult);
        
        console.log('Total campaigns:', totalCampaigns);
        
        // Load each campaign
        const campaignPromises = [];
        for (let i = 0; i < totalCampaigns; i++) {
          campaignPromises.push(
            readContract('get_campaign', [Cl.uint(i)])
              .then(result => {
                if (result.type === 'ok') {
                  const campaignData = cvToValue(result.value);
                  // Transform contract data to match frontend expectations
                  return {
                    id: i.toString(),
                    title: campaignData.name,
                    description: campaignData.description,
                    goal: campaignData.goal / 1000000, // Convert from microSTX
                    raised: campaignData.amount_raised / 1000000,
                    backers: 0, // Would need separate contract call to get this
                    milestonesCount: campaignData.milestones.length,
                    completedMilestones: campaignData.milestones.filter(m => m.status === 'completed').length,
                    category: campaignData.category,
                    endDate: campaignData.status === 'completed' ? 'Completed' : 'Active',
                    status: campaignData.status === 'funding' ? 'funding' : campaignData.status
                  };
                }
                return null;
              })
              .catch(err => {
                console.error(`Error loading campaign ${i}:`, err);
                return null;
              })
          );
        }
        
        const loadedCampaigns = await Promise.all(campaignPromises);
        const validCampaigns = loadedCampaigns.filter(campaign => campaign !== null);
        
        console.log('Loaded campaigns:', validCampaigns);
        setCampaigns(validCampaigns);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        // Fallback to mock data on error
        setCampaigns(mockCampaigns);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [readContract]);

  const mockCampaigns = [
    {
      id: "1",
      title: "Decentralized Social Media Platform",
      description: "Building a censorship-resistant social network powered by blockchain technology for global communities.",
      goal: 50000,
      raised: 32500,
      backers: 127,
      milestonesCount: 4,
      completedMilestones: 2,
      category: "Technology",
      endDate: "30 days",
      status: "funding" as const
    },
    {
      id: "2",
      title: "Sustainable Agriculture Initiative",
      description: "Funding innovative farming techniques to reduce environmental impact and increase crop yields.",
      goal: 25000,
      raised: 18750,
      backers: 89,
      milestonesCount: 3,
      completedMilestones: 1,
      category: "Environment",
      endDate: "45 days",
      status: "milestone-voting" as const
    },
    {
      id: "3",
      title: "Open Source Education Platform",
      description: "Creating free educational resources for underserved communities worldwide with localized content.",
      goal: 75000,
      raised: 75000,
      backers: 203,
      milestonesCount: 5,
      completedMilestones: 5,
      category: "Education",
      endDate: "Completed",
      status: "completed" as const
    },
    {
      id: "4",
      title: "Medical Research Database",
      description: "Developing an open-access database for medical research to accelerate drug discovery processes.",
      goal: 100000,
      raised: 67000,
      backers: 156,
      milestonesCount: 6,
      completedMilestones: 3,
      category: "Healthcare",
      endDate: "60 days",
      status: "funding" as const
    },
    {
      id: "5",
      title: "Climate Change Monitoring System",
      description: "IoT-based system for real-time climate data collection and analysis across multiple regions.",
      goal: 80000,
      raised: 52000,
      backers: 134,
      milestonesCount: 4,
      completedMilestones: 2,
      category: "Environment",
      endDate: "90 days",
      status: "milestone-voting" as const
    },
    {
      id: "6",
      title: "Blockchain Voting System",
      description: "Secure, transparent, and verifiable voting system built on blockchain technology.",
      goal: 120000,
      raised: 89000,
      backers: 298,
      milestonesCount: 5,
      completedMilestones: 3,
      category: "Technology",
      endDate: "75 days",
      status: "funding" as const
    }
  ];

  const displayCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;

  const categories = ["all", "Technology", "Environment", "Education", "Healthcare", "Art", "Social"];
  const statuses = ["all", "funding", "milestone-voting", "completed"];

  const filteredCampaigns = displayCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || campaign.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || campaign.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">All Campaigns</h1>
            <p className="text-verifund-neutral-gray">Discover and support innovative projects</p>
          </div>

          {/* Filters */}
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-verifund-neutral-gray" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-verifund-primary-dark border-verifund-accent-dark text-verifund-light-accent"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-verifund-primary-dark border-verifund-accent-dark text-verifund-light-accent">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-verifund-secondary-dark border-verifund-accent-dark">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-verifund-light-accent">
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-verifund-primary-dark border-verifund-accent-dark text-verifund-light-accent">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-verifund-secondary-dark border-verifund-accent-dark">
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status} className="text-verifund-light-accent">
                        {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-verifund-primary-dark border-verifund-accent-dark text-verifund-light-accent">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-verifund-secondary-dark border-verifund-accent-dark">
                    <SelectItem value="newest" className="text-verifund-light-accent">Newest</SelectItem>
                    <SelectItem value="oldest" className="text-verifund-light-accent">Oldest</SelectItem>
                    <SelectItem value="most-funded" className="text-verifund-light-accent">Most Funded</SelectItem>
                    <SelectItem value="ending-soon" className="text-verifund-light-accent">Ending Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-verifund-accent-dark/30">
                <p className="text-verifund-neutral-gray">
                  Showing {filteredCampaigns.length} of {displayCampaigns.length} campaigns
                  {loading && ' (Loading...)'}
                </p>
                <Button variant="outline" size="sm" className="btn-secondary">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-verifund-light-accent text-xl">Loading campaigns...</div>
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CampaignCard {...campaign} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Filter className="w-16 h-16 text-verifund-neutral-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-verifund-light-accent mb-2">No campaigns found</h3>
                <p className="text-verifund-neutral-gray">
                  Try adjusting your search criteria or browse all campaigns
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                  }}
                  className="btn-primary mt-4"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Load More */}
          {filteredCampaigns.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="btn-secondary">
                Load More Campaigns
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignList;