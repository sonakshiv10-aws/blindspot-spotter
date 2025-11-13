import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Copy, Check } from "lucide-react";
import { toast } from "sonner";

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

interface AnalysisMatrixProps {
  assumptions: Assumption[];
}

const AnalysisMatrix = ({ assumptions }: AnalysisMatrixProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedAssumption, setSelectedAssumption] = useState<Assumption | null>(null);
  const [copied, setCopied] = useState(false);

  // Map risk (1-10) to Y position (350 to 50, inverted because SVG Y goes down)
  const getRiskY = (risk: number) => 350 - ((risk - 1) / 9) * 300;
  
  // Map testability (1-10) to X position (50 to 350)
  const getTestabilityX = (testability: number) => 50 + ((testability - 1) / 9) * 300;
  
  // Truncate text if too long
  const truncate = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Get risk emoji and text
  const getRiskInfo = (risk: number) => {
    if (risk >= 8) return { emoji: "🔴", level: "Critical", explanation: "If this assumption is wrong, it could be fatal to the business." };
    if (risk >= 5) return { emoji: "🟡", level: "Moderate", explanation: "If this assumption is wrong, it will require significant pivoting." };
    return { emoji: "🟢", level: "Low", explanation: "If this assumption is wrong, it can be easily adjusted." };
  };

  // Get testability emoji and text
  const getTestabilityInfo = (testability: number) => {
    if (testability >= 8) return { emoji: "✅", level: "Easy", explanation: "This can be validated quickly and cheaply." };
    if (testability >= 5) return { emoji: "🔶", level: "Moderate", explanation: "This requires moderate time and resources to validate." };
    return { emoji: "⚠️", level: "Difficult", explanation: "This is expensive or time-consuming to validate properly." };
  };

  // Smart label positioning to avoid overlaps
  const getLabelPosition = (index: number, x: number, y: number) => {
    // Alternate label positions based on index and quadrant
    const positions = [
      { dx: 12, dy: -8, anchor: "start" },  // top-right
      { dx: -12, dy: -8, anchor: "end" },   // top-left
      { dx: 12, dy: 20, anchor: "start" },  // bottom-right
      { dx: -12, dy: 20, anchor: "end" },   // bottom-left
    ];
    
    return positions[index % 4];
  };

  // Copy experiment to clipboard
  const copyExperiment = () => {
    if (!selectedAssumption) return;
    
    const text = `Experiment: ${selectedAssumption.experiment.name}
Assumption: ${selectedAssumption.text}
Risk: ${selectedAssumption.risk}/10
Method: ${selectedAssumption.experiment.method}
Cost: ${selectedAssumption.experiment.cost}
Time: ${selectedAssumption.experiment.time}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Experiment plan copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedAssumption(null);
      setHoveredId(null);
    }
  };

  // Add keyboard listener
  useState(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  });
  
  return (
    <>
      <div className="relative w-full h-full">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Background */}
          <rect width="400" height="400" fill="#FAFAFA" rx="8" />
          
          {/* Test Now quadrant highlight (top-right) */}
          <rect x="200" y="50" width="150" height="150" fill="#10B981" opacity="0.05" rx="4" />
          <rect x="200" y="50" width="150" height="150" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.3" rx="4" />
          
          {/* Grid lines */}
          <line x1="200" y1="50" x2="200" y2="350" stroke="#D1D5DB" strokeWidth="2" />
          <line x1="50" y1="200" x2="350" y2="200" stroke="#D1D5DB" strokeWidth="2" />
          
          {/* Axis labels */}
          <text x="30" y="130" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6B7280" transform="rotate(-90 30 130)">
            Risk if Wrong ↑
          </text>
          <text x="80" y="370" textAnchor="start" fontSize="11" fontWeight="600" fill="#6B7280">
            Hard to Test
          </text>
          <text x="320" y="370" textAnchor="end" fontSize="11" fontWeight="600" fill="#6B7280">
            Easy to Test →
          </text>
          
          {/* Quadrant labels */}
          {/* TOP-LEFT: Critical Risk - RED */}
          <text x="125" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#EF4444">
            Critical Risk
          </text>
          
          {/* TOP-RIGHT: Test Now - GREEN with Priority badge */}
          <text x="275" y="95" textAnchor="middle" fontSize="11" fontWeight="600" fill="#10B981">
            Test Now
          </text>
          <text x="275" y="110" textAnchor="middle" fontSize="9" fontWeight="500" fill="#10B981" opacity="0.8">
            Priority #1
          </text>
          
          {/* BOTTOM-LEFT: Defer / Monitor - BLUE */}
          <text x="125" y="300" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3B82F6">
            Defer / Monitor
          </text>
          
          {/* BOTTOM-RIGHT: Quick Wins - YELLOW */}
          <text x="275" y="300" textAnchor="middle" fontSize="11" fontWeight="600" fill="#F59E0B">
            Quick Wins
          </text>
          
          {/* Plot assumptions */}
          {assumptions.map((assumption, index) => {
            const x = getTestabilityX(assumption.testability);
            const y = getRiskY(assumption.risk);
            const color = assumption.isHiddenBlindSpot ? "#EF4444" : "#10B981";
            const isHovered = hoveredId === assumption.id;
            const isOtherHovered = hoveredId !== null && !isHovered;
            const labelPos = getLabelPosition(index, x, y);
            
            return (
              <g 
                key={assumption.id}
                style={{ 
                  opacity: isOtherHovered ? 0.4 : 1,
                  transition: "opacity 0.3s ease, transform 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={() => setHoveredId(assumption.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedAssumption(assumption)}
              >
                {/* Pulsing glow for blind spots */}
                {assumption.isHiddenBlindSpot && (
                  <circle cx={x} cy={y} r="12" fill={color} opacity="0.3">
                    <animate
                      attributeName="r"
                      from="8"
                      to="16"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                
                {/* Main dot */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? 10 : 8}
                  fill={color} 
                  opacity="0.9"
                  filter={isHovered ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : ""}
                  style={{ transition: "all 0.2s ease" }}
                />
                
                {/* Label with white background */}
                <rect
                  x={labelPos.anchor === "start" ? x + labelPos.dx : x + labelPos.dx - 80}
                  y={y + labelPos.dy - 10}
                  width="80"
                  height="18"
                  fill="white"
                  opacity="0.9"
                  rx="3"
                />
                <text 
                  x={x + labelPos.dx} 
                  y={y + labelPos.dy} 
                  textAnchor={labelPos.anchor as any}
                  fontSize="8" 
                  fill="#374151" 
                  fontWeight="600"
                  style={{ pointerEvents: "none" }}
                >
                  {truncate(assumption.text, 15)}
                </text>

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <foreignObject 
                      x={x - 120} 
                      y={y - 140} 
                      width="240" 
                      height="130"
                    >
                      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-fade-in">
                        <div className="text-sm font-semibold text-gray-900 mb-2">
                          {assumption.text}
                        </div>
                        <div className="text-xs space-y-1 text-gray-600">
                          <div>Risk: {assumption.risk}/10 {getRiskInfo(assumption.risk).emoji} {getRiskInfo(assumption.risk).level}</div>
                          <div>Testability: {assumption.testability}/10 {getTestabilityInfo(assumption.testability).emoji} {getTestabilityInfo(assumption.testability).level}</div>
                          {assumption.isHiddenBlindSpot && (
                            <div className="mt-2 text-red-600 font-semibold">🚨 Hidden Blind Spot</div>
                          )}
                          <div className="mt-2 text-blue-600 font-medium">Click for experiment details →</div>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* Border */}
          <rect width="400" height="400" fill="none" stroke="#D1D5DB" strokeWidth="2" rx="8" />
        </svg>
      </div>

      {/* Detail Panel */}
      <Sheet open={selectedAssumption !== null} onOpenChange={(open) => !open && setSelectedAssumption(null)}>
        <SheetContent className="w-full sm:w-[400px] overflow-y-auto">
          {selectedAssumption && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-lg font-bold pr-8">
                  {selectedAssumption.text}
                </SheetTitle>
                {selectedAssumption.isHiddenBlindSpot && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    🚨 Hidden Blind Spot
                  </div>
                )}
              </SheetHeader>

              <div className="space-y-6">
                {/* Assessment Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📊 Assessment
                  </h3>
                  <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Risk if Wrong: {selectedAssumption.risk}/10 {getRiskInfo(selectedAssumption.risk).emoji}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {getRiskInfo(selectedAssumption.risk).explanation}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Testability: {selectedAssumption.testability}/10 {getTestabilityInfo(selectedAssumption.testability).emoji}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {getTestabilityInfo(selectedAssumption.testability).explanation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experiment Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🔬 Recommended Experiment
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="font-semibold text-blue-900">
                      {selectedAssumption.experiment.name}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-800 mb-1">Method:</div>
                      <div className="text-sm text-blue-700">
                        {selectedAssumption.experiment.method}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">💰 Cost:</span>{" "}
                        <span className="text-blue-700">{selectedAssumption.experiment.cost}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">⏱️ Time:</span>{" "}
                        <span className="text-blue-700">{selectedAssumption.experiment.time}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={copyExperiment}
                    variant="outline"
                    className="w-full mt-3"
                  >
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
                </div>

                {/* Why This Matters */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    💡 Why This Matters
                  </h3>
                  <div className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    {selectedAssumption.risk >= 8 ? (
                      "This is a critical assumption that could make or break your business. Validating this early will save you from building on a faulty foundation."
                    ) : selectedAssumption.risk >= 5 ? (
                      "This assumption has significant impact on your business model. Testing it now will help you make informed decisions about your direction."
                    ) : (
                      "While lower risk, validating this assumption will help you optimize your approach and build confidence in your solution."
                    )}
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

export default AnalysisMatrix;
