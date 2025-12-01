import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Assumption {
  id: string;
  text: string;
  isHiddenBlindSpot: boolean;
  risk: number;
  testability: number;
  category: string;
  experiment: {
    name: string;
    description: string;
    timeframe: string;
    resources: string;
  };
}

interface AssumptionListProps {
  assumptions: Assumption[];
}

const AssumptionList = ({ assumptions }: AssumptionListProps) => {
  const [selectedAssumption, setSelectedAssumption] = useState<Assumption | null>(null);
  const [copied, setCopied] = useState(false);

  // Group assumptions by quadrant
  const getQuadrant = (assumption: Assumption) => {
    const isHighRisk = assumption.risk >= 7;
    const isHighTestability = assumption.testability >= 8;

    if (isHighRisk && isHighTestability) return "testNow";
    if (isHighRisk && !isHighTestability) return "criticalRisk";
    if (!isHighRisk && isHighTestability) return "quickWins";
    return "defer";
  };

  const grouped = {
    testNow: assumptions.filter((a) => getQuadrant(a) === "testNow"),
    criticalRisk: assumptions.filter((a) => getQuadrant(a) === "criticalRisk"),
    quickWins: assumptions.filter((a) => getQuadrant(a) === "quickWins"),
    defer: assumptions.filter((a) => getQuadrant(a) === "defer"),
  };

  const copyExperiment = () => {
    if (!selectedAssumption) return;

    const text = `Experiment: ${selectedAssumption.experiment.name}
Assumption: ${selectedAssumption.text}
Risk: ${selectedAssumption.risk}/10
Method: ${selectedAssumption.experiment.description}
Cost: ${selectedAssumption.experiment.resources}
Time: ${selectedAssumption.experiment.timeframe}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Experiment plan copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const QuadrantSection = ({
    title,
    color,
    emoji,
    assumptions,
  }: {
    title: string;
    color: string;
    emoji: string;
    assumptions: Assumption[];
  }) => {
    if (assumptions.length === 0) return null;

    return (
      <div className="mb-6">
        <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 border-${color}-200`}>
          <span className="text-2xl">{emoji}</span>
          <h3 className={`text-lg font-bold text-${color}-700`}>
            {title} ({assumptions.length})
          </h3>
        </div>

        <div className="space-y-3">
          {assumptions.map((assumption) => (
            <div
              key={assumption.id}
              onClick={() => setSelectedAssumption(assumption)}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all active:scale-98"
            >
              <div className="font-medium text-gray-900 mb-2 leading-snug">
                {assumption.text}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-600">Risk:</span>
                  <span className={`font-semibold ${assumption.risk >= 8 ? "text-red-600" : assumption.risk >= 5 ? "text-yellow-600" : "text-green-600"}`}>
                    {assumption.risk}/10
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-600">Test:</span>
                  <span className={`font-semibold ${assumption.testability >= 8 ? "text-green-600" : assumption.testability >= 5 ? "text-yellow-600" : "text-red-600"}`}>
                    {assumption.testability}/10
                  </span>
                </div>
              </div>

              {assumption.isHiddenBlindSpot && (
                <div className="mt-2 inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                  🚨 Hidden Blind Spot
                </div>
              )}

              <div className="mt-3 text-blue-600 text-sm font-medium">
                → Tap for experiment details
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6 px-4">
        <QuadrantSection
          title="Test Now"
          color="green"
          emoji="🎯"
          assumptions={grouped.testNow}
        />
        
        <QuadrantSection
          title="Critical Risk"
          color="red"
          emoji="⚠️"
          assumptions={grouped.criticalRisk}
        />
        
        <QuadrantSection
          title="Quick Wins"
          color="yellow"
          emoji="✅"
          assumptions={grouped.quickWins}
        />
        
        <QuadrantSection
          title="Defer / Monitor"
          color="blue"
          emoji="📊"
          assumptions={grouped.defer}
        />
      </div>

      <Sheet open={selectedAssumption !== null} onOpenChange={(open) => !open && setSelectedAssumption(null)}>
        <SheetContent className="w-full sm:w-[400px] overflow-y-auto">
          {selectedAssumption && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-lg font-bold pr-8">{selectedAssumption.text}</SheetTitle>
                {selectedAssumption.isHiddenBlindSpot && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    🚨 Hidden Blind Spot
                  </div>
                )}
              </SheetHeader>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🔬 Recommended Experiment
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="font-semibold text-blue-900">{selectedAssumption.experiment.name}</div>
                  <div>
                    <div className="text-xs font-medium text-blue-800 mb-1">How to Test:</div>
                    <div className="text-sm text-blue-700 leading-relaxed">
                      {selectedAssumption.experiment.description}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">💰 Cost:</span>{" "}
                      <span className="text-blue-700">{selectedAssumption.experiment.resources}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">⏱️ Time:</span>{" "}
                      <span className="text-blue-700">{selectedAssumption.experiment.timeframe}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={copyExperiment} variant="outline" className="w-full mt-3">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Experiment Plan
                    </>
                  )}
                </Button>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    💡 Why This Matters
                  </h3>
                  <div className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    {(() => {
                      const quadrant = getQuadrant(selectedAssumption);
                      if (quadrant === "testNow") {
                        return "This is both critical AND easy to test - your top priority. Test this immediately before building anything else.";
                      } else if (quadrant === "criticalRisk") {
                        return "This is a critical assumption that's expensive or time-consuming to validate. If wrong, your business model fails.";
                      } else if (quadrant === "quickWins") {
                        return "This is a low-risk assumption that's cheap and easy to validate. Test it quickly to optimize your approach.";
                      } else {
                        return "This assumption has lower impact and is harder to test. Consider deferring validation until you've tested critical assumptions.";
                      }
                    })()}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AssumptionList;