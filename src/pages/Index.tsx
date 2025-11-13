import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import MatrixPreview from "@/components/MatrixPreview";

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");

  const loadingMessages = [
    "Applying first principles...",
    "Extracting assumptions...",
    "Verifying facts...",
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

  const handleAnalyze = () => {
    setIsLoading(true);
    
    // Simulate loading for demo
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 10000);
  };

  const isInputValid = userInput.trim().length >= 10;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header - 15% */}
      <header className="h-[15vh] flex flex-col items-center justify-center px-6 border-b border-border">
        <h1 className="text-3xl lg:text-5xl font-bold text-center mb-2">
          Find the Assumptions You Didn't Know You Had
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground text-center">
          AI-powered first principles analysis in 30 seconds
        </p>
      </header>

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
        <div className="w-full lg:w-[60%] p-8 lg:p-12 flex flex-col items-center justify-center bg-secondary/30">
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

          {showResults && !isLoading && (
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-border">
                <p className="text-xl text-muted-foreground text-center">Results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
