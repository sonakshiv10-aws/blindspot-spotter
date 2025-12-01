import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import MatrixPreview from "@/components/MatrixPreview";
import AnalysisMatrix from "@/components/AnalysisMatrix";
import AssumptionList from "@/components/AssumptionList";

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
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'ai' | 'manual'>('ai');
  const [manualAssumptions, setManualAssumptions] = useState<string[]>(['']);

  const loadingMessages = [
    "Applying first principles thinking...",
    "Extracting assumptions...",
    "Finding blind spots...",
  ];

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

  
  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    
try {
      // Call our API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productContext: inputMode === 'ai' ? userInput : null,
          manualAssumptions: inputMode === 'manual' 
            ? manualAssumptions.filter(a => a.trim()) 
            : null,
          mode: inputMode,
        }), 
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log("🔍 API Response:", JSON.stringify(data, null, 2));
      setAnalysisData(data);
      setIsLoading(false);
      setShowResults(true);
      
     
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

  const isInputValid = inputMode === 'ai' 
  ? userInput.trim().length >= 10
  : manualAssumptions.filter(a => a.trim().length > 0).length >= 1;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header - 15% */}
      <header className="flex flex-col items-center justify-center px-4 py-6 border-b border-border relative max-w-[1600px] mx-auto w-full">
        <h1 className="text-3xl lg:text-5xl font-bold text-center mb-2">
          Find the Assumptions You Didn't Know You Had
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground text-center">
          AI-powered first principles analysis in 30 seconds
        </p>
        </header>

    {/* Main Section - 85% */}
    <main className="flex-1 flex flex-col xl:flex-row justify-center max-w-[1600px] mx-auto w-full xl:gap-[60px] px-4 xl:px-10">
      {/* Left Panel - Fixed 450px width on desktop, full width on mobile */}
      <div className="w-full xl:w-[450px] p-6 xl:p-10 flex flex-col border-b xl:border-b-0 border-border xl:flex-shrink-0 xl:max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">What Are You Building?</h2>

        {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode('ai')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            inputMode === 'ai'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✨ AI Analysis
        </button>
              <button
                onClick={() => setInputMode('manual')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  inputMode === 'manual'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ✍️ Manual Entry
              </button>
            </div>

          {/* Conditional Input Based on Mode */}
          {inputMode === 'ai' ? (
              // AI Mode - Existing textarea
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., A valet parking app that lets you park anywhere in SF&#10;e.g., A dark mode feature for our fitness app&#10;e.g., An AI-powered design system for enterprise teams"
                className="flex-1 min-h-[100px] text-base mb-4 resize-none"
                maxLength={500}
              />
            ) : (
              // Manual Mode - New input fields
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Enter your assumptions one at a time. We'll analyze them for risk and testability.
                </p>
                {manualAssumptions.map((assumption, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={assumption}
                      onChange={(e) => {
                        const updated = [...manualAssumptions];
                        updated[index] = e.target.value;
                        setManualAssumptions(updated);
                      }}
                      placeholder={`Assumption ${index + 1}: e.g., "Users will pay $15/month for this tool"`}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={150}
                    />
                    {manualAssumptions.length > 1 && (
                      <button
                        onClick={() => {
                          const updated = manualAssumptions.filter((_, i) => i !== index);
                          setManualAssumptions(updated);
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {manualAssumptions.length < 8 && (
                  <button
                    onClick={() => setManualAssumptions([...manualAssumptions, ''])}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    + Add Another Assumption
                  </button>
                )}
              </div>
            )}
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
            {inputMode === 'ai' 
  ? `${userInput.length} / 500 characters`
  : `${manualAssumptions.filter(a => a.trim()).length} / 8 assumptions`
} 
            </span>
            <span className={`text-sm ${isInputValid ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {isInputValid ? "✓ Ready to analyze" : inputMode === 'ai' ? "Min. 10 characters" : "Add at least 1 assumption"} 
            </span>
          </div>

          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={!isInputValid || isLoading}
            className="w-full text-lg py-6 h-auto mb-4"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            {inputMode === 'ai' ? 'Find My Blind Spots' : 'Analyze My Assumptions'}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            <Sparkles className="inline w-4 h-4 mr-1" />
            Using first principles thinking
          </p>          
          </div>

        {/* Right Panel - Flexible width on desktop, full width on mobile */}
        <div className="flex-1 w-full overflow-y-auto flex flex-col items-center">
          {!showResults && !isLoading && (
            <div className="hidden lg:flex h-full items-center justify-center p-6 lg:p-10 w-full">
              <div className="space-y-6 w-full max-w-[1100px]">
                {/* Blind Spots Badge */}
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full font-semibold text-sm shadow-sm">
                  🚨 3 Hidden Blind Spots Found
                </div>

                {/* First Principles Insight */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    First Principles Insight
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {MOCK_ANALYSIS.firstPrinciplesInsight}
                  </p>
                </div>

                {/* Analysis Matrix - Example */}
                <div className="bg-white rounded-xl shadow-lg p-4 lg:p-8 overflow-x-auto">
                  <AnalysisMatrix assumptions={MOCK_ANALYSIS.assumptions} />
                </div>

                {/* Example Label */}
                <div className="text-center text-slate-500 text-xs -mt-2 pb-4 xl:pb-0">
  Example: Valet parking app analysis
</div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-8 w-full">
              <div className="w-full max-w-md space-y-8 text-center">
                <div className="relative mx-auto w-32 h-32">
                  <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-medium text-foreground animate-pulse">
                    {currentLoadingMessage}
                  </p>
                  <p className="text-muted-foreground">This usually takes 10-30 seconds</p>
                </div>
              </div>
            </div>
          )}

          {showResults && analysisData && (
           <div className="space-y-3 xl:space-y-6 w-full max-w-[1100px]"> 
              {/* Blind Spots Badge */}
              {analysisData.assumptions.filter(a => a.isHiddenBlindSpot).length > 0 && (
  <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full font-semibold text-sm shadow-sm mx-4 xl:mx-0">
    🚨 {analysisData.assumptions.filter(a => a.isHiddenBlindSpot).length} Hidden Blind Spot{analysisData.assumptions.filter(a => a.isHiddenBlindSpot).length > 1 ? 's' : ''} Found
  </div>
)}

              {/* First Principles Insight */}
              {analysisData.firstPrinciplesInsight && (
  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 shadow-sm mx-4 xl:mx-0">
    <h3 className="text-base font-semibold text-purple-900 mb-2 flex items-center gap-2">
      <Sparkles className="w-4 h-4" />
      First Principles Insight
    </h3>
    <p className="text-sm text-slate-700 leading-relaxed">
      {analysisData.firstPrinciplesInsight}
    </p>
  </div>
)}

              {/* Analysis Matrix - 700x700 */}
              <div className="hidden lg:block bg-white xl:rounded-lg xl:shadow-lg p-0 xl:p-8 w-screen xl:w-full -mx-4 xl:mx-0">
  <AnalysisMatrix assumptions={analysisData.assumptions} />
</div>

<div className="lg:hidden">
  <AssumptionList assumptions={analysisData.assumptions} />
</div>
              {/* Analysis Complete Message */}
              <div className="text-center text-slate-600 text-sm pt-2 pb-4">
                Analysis complete 
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
