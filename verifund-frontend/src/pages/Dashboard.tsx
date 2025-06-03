import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wallet, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CampaignCard from "@/components/CampaignCard";

const Dashboard = () => {
  const userStats = {
    totalRaised: 125000,
    totalBacked: 45000,
    activeCampaigns: 3,
    completedCampaigns: 2,
    backedCampaigns: 12
  };

  const createdCampaigns = [
    {
      id: "1",
      title: "Decentralized Social Media Platform",
      description: "Building a censorship-resistant social network",
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
      title: "AI-Powered Learning Assistant",
      description: "Personalized education through artificial intelligence",
      goal: 75000,
      raised: 67500,
      backers: 203,
      milestonesCount: 5,
      completedMilestones: 4,
      category: "Education",
      endDate: "15 days",
      status: "milestone-voting" as const
    }
  ];

  const backedCampaigns = [
    {
      id: "3",
      title: "Sustainable Agriculture Initiative",
      description: "Funding innovative farming techniques",
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
      id: "4",
      title: "Open Source Education Platform",
      description: "Creating free educational resources",
      goal: 30000,
      raised: 30000,
      backers: 156,
      milestonesCount: 4,
      completedMilestones: 4,
      category: "Education",
      endDate: "Completed",
      status: "completed" as const
    }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-verifund-forest-dark mb-2">Dashboard</h1>
              <p className="text-verifund-earth-brown">Track your campaigns and contributions</p>
            </div>
            <Link to="/create">
              <Button className="btn-primary">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-verifund-earth-brown text-sm">Total Raised</p>
                    <p className="text-verifund-forest-dark text-2xl font-bold">
                      ${userStats.totalRaised.toLocaleString()} STX
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-verifund-earth-brown text-sm">Total Backed</p>
                    <p className="text-verifund-forest-dark text-2xl font-bold">
                      ${userStats.totalBacked.toLocaleString()} STX
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-verifund-earth-brown text-sm">Active Campaigns</p>
                    <p className="text-verifund-forest-dark text-2xl font-bold">
                      {userStats.activeCampaigns}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-verifund-earth-brown text-sm">Completed</p>
                    <p className="text-verifund-forest-dark text-2xl font-bold">
                      {userStats.completedCampaigns}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-verifund-earth-brown text-sm">Backed Projects</p>
                    <p className="text-verifund-forest-dark text-2xl font-bold">
                      {userStats.backedCampaigns}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Tabs */}
          <Tabs defaultValue="created" className="space-y-6">
            <TabsList className="bg-white/90 border border-verifund-sage/30">
              <TabsTrigger value="created" className="data-[state=active]:bg-verifund-sage text-verifund-forest-dark data-[state=active]:text-white">
                Created Campaigns ({createdCampaigns.length})
              </TabsTrigger>
              <TabsTrigger value="backed" className="data-[state=active]:bg-verifund-sage text-verifund-forest-dark data-[state=active]:text-white">
                Backed Campaigns ({backedCampaigns.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-verifund-forest-dark">Your Campaigns</h2>
                <Link to="/create">
                  <Button variant="outline" className="btn-secondary">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Campaign
                  </Button>
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="backed" className="space-y-6">
              <h2 className="text-2xl font-bold text-verifund-forest-dark">Campaigns You've Backed</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {backedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Recent Activity */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle className="text-verifund-forest-dark">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 py-3 border-b border-verifund-sage/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-verifund-forest-dark">Milestone approved for "AI-Powered Learning Assistant"</p>
                    <p className="text-verifund-earth-brown text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 py-3 border-b border-verifund-sage/30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-verifund-forest-dark">New backer joined "Decentralized Social Media Platform"</p>
                    <p className="text-verifund-earth-brown text-sm">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 py-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-verifund-forest-dark">Milestone voting started for "Sustainable Agriculture Initiative"</p>
                    <p className="text-verifund-earth-brown text-sm">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
