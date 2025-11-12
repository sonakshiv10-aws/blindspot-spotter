import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, Sparkles, CheckCircle2, Target, Zap } from "lucide-react";
import MatrixPreview from "@/components/MatrixPreview";

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("");

  const loadingMessages = [
    "Applying first principles thinking...",
    "Extracting implicit assumptions...",
    "Verifying facts from web sources...",
    "Plotting on risk × testability matrix...",
    "Finding your blind spots...",
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

  const scrollToInput = () => {
    document.getElementById("input")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = () => {
    setIsLoading(true);
    document.getElementById("loading")?.scrollIntoView({ behavior: "smooth" });
    
    // Simulate loading for demo
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 10000);
  };

  const isInputValid = userInput.trim().length >= 10;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative py-20 px-6 lg:px-8 bg-gradient-to-b from-background to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Find the Assumptions You Didn't Know You Had
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered first principles analysis that reveals your blind spots in 30 seconds
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
            {/* Left column - Benefits */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Uncover hidden risks before you build</h3>
                  <p className="text-muted-foreground">Discover critical assumptions you haven't considered</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Get experiment recommendations ranked by priority</h3>
                  <p className="text-muted-foreground">Know exactly which assumptions to test first</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">See which assumptions are verified vs need research</h3>
                  <p className="text-muted-foreground">Clear visual matrix showing what's risky and what's validated</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Built for PMs, UX designers, and product teams</h3>
                  <p className="text-muted-foreground">Perfect for validating ideas before investing resources</p>
                </div>
              </div>
            </div>

            {/* Right column - Matrix preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-border">
              <div className="aspect-square mb-4">
                <MatrixPreview />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Example: Valet parking app analysis
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={scrollToInput}
              className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              Analyze Your Idea
              <ArrowDown className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              30 seconds • No signup required
            </p>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section id="example" className="py-20 px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-secondary rounded-xl p-8 border-2 border-border">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">You input</h3>
              <p className="text-muted-foreground italic">
                "A valet parking app for San Francisco"
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-secondary rounded-xl p-8 border-2 border-border">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI analyzes</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Breaks down into first principles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Extracts hidden assumptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Verifies facts from web sources</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-secondary rounded-xl p-8 border-2 border-border">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">You get insights</h3>
              <div className="bg-white rounded-lg p-4 border border-border">
                <div className="aspect-square">
                  <MatrixPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section id="input" className="py-20 px-6 lg:px-8 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-8">What Are You Building?</h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-border">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g., A valet parking app that lets you park anywhere in SF&#10;e.g., A dark mode feature for our fitness app&#10;e.g., An AI-powered design system for enterprise teams"
              className="min-h-[200px] text-lg mb-4 resize-none"
              maxLength={500}
            />
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground">
                {userInput.length} / 500 characters
              </span>
              <span className={`text-sm ${isInputValid ? "text-primary" : "text-muted-foreground"}`}>
                {isInputValid ? "✓ Ready to analyze" : "Min. 10 characters"}
              </span>
            </div>

            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!isInputValid || isLoading}
              className="w-full text-lg py-6 h-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Find My Blind Spots
            </Button>
            
            <p className="text-sm text-muted-foreground text-center mt-4">
              ✨ AI will analyze using first principles thinking
            </p>
          </div>
        </div>
      </section>

      {/* Loading Section */}
      {isLoading && (
        <section id="loading" className="py-20 px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="max-w-2xl mx-auto text-center">
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
        </section>
      )}

      {/* Results Placeholder */}
      {showResults && (
        <section id="results" className="py-20 px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="bg-secondary rounded-2xl p-12 border-2 border-dashed border-border text-center">
              <p className="text-xl text-muted-foreground">Results will appear here</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
