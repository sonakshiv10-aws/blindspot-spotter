import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Settings, Eye, EyeOff, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import MatrixPreview from "@/components/MatrixPreview";
import AnalysisMatrix from "@/components/AnalysisMatrix";

interface Assumption {
  id: string;
  text: string;
  isHiddenBlindSpot: boolean;
  risk: number;
  testability: number;
  experiment: {
    name: string;
    method: string;
    cost: string;
    time: string;
  };
}

interface AnalysisData {
  firstPrinciplesInsight: string;
  assumptions: Assumption[];
}

const MOCK_ANALYSIS: AnalysisData = {
  "firstPrinciplesInsight": "The core assumption isn't about parking scarcity—it's about whether people value optionality over planning. Valet services work when spontaneity has higher value than the cost premium. Test: Are your users making last-minute decisions, or do they plan their parking in advance?",
  "assumptions": [
    {
      "id": "assumption-1",
      "text": "Parking scarcity exists in SF",
      "isHiddenBlindSpot": false,
      "risk": 9,
      "testability": 9,
      "experiment": {
        "name": "Parking Data Analysis",
        "method": "Research SFMTA reports + survey 50 drivers about parking difficulty",
        "cost": "$0-500",
        "time": "2 days"
      }
    },
    {
      "id": "assumption-2",
      "text": "People trust strangers with their cars",
      "isHiddenBlindSpot": false,
      "risk": 9,
      "testability": 7,
      "experiment": {
        "name": "Trust Experiment",
        "method": "Offer manual valet service to 20 people, track acceptance rate",
        "cost": "$200",
        "time": "3 days"
      }
    },
    {
      "id": "assumption-3",
      "text": "Users will pay premium for convenience",
      "isHiddenBlindSpot": false,
      "risk": 8,
      "testability": 8,
      "experiment": {
        "name": "Price Sensitivity Test",
        "method": "Survey 100 drivers with different price points ($5, $10, $15, $20)",
        "cost": "$100",
        "time": "1 week"
      }
    },
    {
      "id": "assumption-4",
      "text": "Insurance liability is solvable",
      "isHiddenBlindSpot": true,
      "risk": 10,
      "testability": 3,
      "experiment": {
        "name": "Legal Consultation",
        "method": "Meet with insurance lawyers and review liability precedents",
        "cost": "$2,000-5,000",
        "time": "2-4 weeks"
      }
    },
    {
      "id": "assumption-5",
      "text": "Unit economics work (valet cost + time + parking < user pays)",
      "isHiddenBlindSpot": true,
      "risk": 9,
      "testability": 8,
      "experiment": {
        "name": "Manual Operations Test",
        "method": "Hire 3 valets for one day, track: time per park, wages, parking costs vs. user willingness to pay",
        "cost": "$500",
        "time": "1 day"
      }
    },
    {
      "id": "assumption-6",
      "text": "Drivers can book while driving safely",
      "isHiddenBlindSpot": false,
      "risk": 6,
      "testability": 8,
      "experiment": {
        "name": "UX Usability Test",
        "method": "Test voice booking or one-tap interface with 15 users in car simulator",
        "cost": "$300",
        "time": "3 days"
      }
    },
    {
      "id": "assumption-7",
      "text": "Valets are available when/where needed",
      "isHiddenBlindSpot": true,
      "risk": 8,
      "testability": 6,
      "experiment": {
        "name": "Supply Analysis",
        "method": "Map demand patterns vs. valet availability in target neighborhoods",
        "cost": "$200",
        "time": "1 week"
      }
    }
  ]
};

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isKeySaved, setIsKeySaved] = useState(false);

  const loadingMessages = [
    "Applying first principles thinking...",
    "Extracting assumptions...",
    "Finding blind spots...",
  ];

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('claude_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setTempApiKey(storedKey);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      let index = 0;
      setCurrentLoadingMessage(loadingMessages[0]);
      
      const interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setCurrentLoadingMessage(loadingMessages[index]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSaveApiKey = () => {
    if (!tempApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem('claude_api_key', tempApiKey);
    setApiKey(tempApiKey);
    setIsKeySaved(true);
    
    setTimeout(() => {
      setIsKeySaved(false);
      setIsSettingsOpen(false);
    }, 1500);
    
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    
    try {
      // Simulate API call with 3 second delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Use mock data
      setAnalysisData(MOCK_ANALYSIS);
      setIsLoading(false);
      setShowResults(true);
      
      const blindSpots = MOCK_ANALYSIS.assumptions.filter(a => a.isHiddenBlindSpot).length;
      toast({
        title: "Analysis Complete",
        description: `Found ${MOCK_ANALYSIS.assumptions.length} assumptions (${blindSpots} blind spots)`,
      });
      
    } catch (err) {
      console.error('Analysis error:', err);
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
    }
  };

  const isInputValid = userInput.trim().length >= 10;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header - 15% */}
      <header className="h-[15vh] flex flex-col items-center justify-center px-6 border-b border-border relative">
        <h1 className="text-3xl lg:text-5xl font-bold text-center mb-2">
          Find the Assumptions You Didn't Know You Had
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground text-center">
          AI-powered first principles analysis in 30 seconds
        </p>
        
        {/* Settings Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-4 right-4 gap-2"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </header>
      
      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Configuration (Testing Only)</DialogTitle>
            <DialogDescription>
              Enter your Claude API key to enable analysis. This is stored in your browser only.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                Claude API Key
              </label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk-ant-api03-..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleSaveApiKey}
              className="w-full"
              disabled={isKeySaved}
            >
              {isKeySaved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  API Key Saved
                </>
              ) : (
                'Save Key'
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              ⚠️ For testing only. We'll move to secure backend before launch.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Section - 85% */}
      <main className="h-[85vh] flex flex-col lg:flex-row">
        {/* Left Panel - Input */}
        <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col border-r border-border overflow-y-auto">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">What Are You Building?</h2>
          
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., A valet parking app that lets you park anywhere in SF&#10;e.g., A dark mode feature for our fitness app&#10;e.g., An AI-powered design system for enterprise teams"
            className="flex-1 min-h-[200px] text-base lg:text-lg mb-4 resize-none"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              {userInput.length} / 500 characters
            </span>
            <span className={`text-sm ${isInputValid ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {isInputValid ? "✓ Ready to analyze" : "Min. 10 characters"}
            </span>
          </div>

          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={!isInputValid || isLoading}
            className="w-full text-lg py-6 h-auto mb-4"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            Find My Blind Spots
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            <Sparkles className="inline w-4 h-4 mr-1" />
            Using first principles thinking
          </p>
        </div>

        {/* Right Panel - Matrix/Results */}
        <div className="w-full lg:w-[60%] p-8 lg:p-12 flex flex-col items-center justify-center bg-secondary/30 overflow-y-auto">
          {!isLoading && !showResults && (
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-border">
                <div className="aspect-square mb-6">
                  <MatrixPreview />
                </div>
                <p className="text-base text-muted-foreground text-center font-medium">
                  Example: Valet parking app analysis
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto relative">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                  <div className="absolute inset-0 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-2xl font-semibold text-primary animate-fade-in">
                {currentLoadingMessage}
              </p>
            </div>
          )}

          {showResults && !isLoading && analysisData && (
            <div className="w-full max-w-2xl space-y-6 animate-fade-in">
              {/* First Principles Insight */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-1">💡 First Principles Insight</p>
                <p className="text-sm text-blue-800">{analysisData.firstPrinciplesInsight}</p>
              </div>
              
              {/* Analysis Matrix */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-border">
                {/* Blind Spots Badge */}
                {analysisData.assumptions.filter(a => a.isHiddenBlindSpot).length > 0 && (
                  <div className="mb-4 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                      🚨 {analysisData.assumptions.filter(a => a.isHiddenBlindSpot).length} Blind Spots Found
                    </span>
                  </div>
                )}
                <div className="aspect-square">
                  <AnalysisMatrix assumptions={analysisData.assumptions} />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Using mock data - real API will be connected via backend
                </p>
              </div>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="w-full max-w-2xl">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-900 mb-1">Error</p>
                <p className="text-sm text-red-800">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAnalyze}
                  className="mt-3"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
