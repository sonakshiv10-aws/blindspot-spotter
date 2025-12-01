import { useState, useEffect } from "react";
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
  category: string;
  experiment: {
    name: string;
    description: string;
    timeframe: string;
    resources: string;
  };
}
  
interface AnalysisMatrixProps {
  assumptions: Assumption[];
}

const AnalysisMatrix = ({ assumptions }: AnalysisMatrixProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedTooltipId, setLockedTooltipId] = useState<string | null>(null);
  const [selectedAssumption, setSelectedAssumption] = useState<Assumption | null>(null);
  const [copied, setCopied] = useState(false);

  // Map risk (1-10) to Y position (inverted because SVG Y goes down)
  // Keep dots 20px away from borders for 650x650 matrix
  const getRiskY = (risk: number) => {
    const y = 630 - ((risk - 1) / 9) * 590;
    return Math.max(40, Math.min(630, y));
  };

  // Map testability (1-10) to X position
  // Keep dots 20px away from borders for 650x650 matrix
  const getTestabilityX = (testability: number) => {
    const x = 40 + ((testability - 1) / 9) * 590;
    return Math.max(40, Math.min(630, x));
  };

  // Smart truncate text keeping important words (max 20 chars for matrix labels)
  const truncate = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    // Try to break at word boundary
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > maxLength * 0.5) {
      return text.substring(0, lastSpace) + "...";
    }
    return truncated + "...";
  };

  // Get risk emoji and text
  const getRiskInfo = (risk: number) => {
    if (risk >= 8)
      return {
        emoji: "🔴",
        level: "Critical",
        explanation: "If this assumption is wrong, it could be fatal to the business.",
      };
    if (risk >= 5)
      return {
        emoji: "🟡",
        level: "Moderate",
        explanation: "If this assumption is wrong, it will require significant pivoting.",
      };
    return { emoji: "🟢", level: "Low", explanation: "If this assumption is wrong, it can be easily adjusted." };
  };

  // Get testability emoji and text
  const getTestabilityInfo = (testability: number) => {
    if (testability >= 8)
      return { emoji: "✅", level: "Easy", explanation: "This can be validated quickly and cheaply." };
    if (testability >= 5)
      return { emoji: "🔶", level: "Moderate", explanation: "This requires moderate time and resources to validate." };
    return {
      emoji: "⚠️",
      level: "Difficult",
      explanation: "This is expensive or time-consuming to validate properly.",
    };
  };

  // Smart label positioning to avoid overlaps
  const getLabelPosition = (index: number, x: number, y: number) => {
    // Alternate label positions based on index and quadrant
    const positions = [
      { dx: 12, dy: -8, anchor: "start" }, // top-right
      { dx: -12, dy: -8, anchor: "end" }, // top-left
      { dx: 12, dy: 20, anchor: "start" }, // bottom-right
      { dx: -12, dy: 20, anchor: "end" }, // bottom-left
    ];

    return positions[index % 4];
  };

  // Matrix boundaries - define at component level
const matrixLeft = 100;
const matrixRight = 750;
const matrixTop = 50;
const matrixBottom = 700;
const padding = 20;

  // Smart tooltip positioning to avoid cutoff
  const getTooltipPosition = (x: number, y: number) => {
    const tooltipWidth = 320;
    const tooltipHeight = 220;
    
    let tooltipX = x - tooltipWidth / 2;
    let tooltipY = y - tooltipHeight - 15; // Default: above dot

    // If in top half, show below
    if (y < 375) {
      tooltipY = y + 15;
    }

    // If too close to left edge of matrix, show to right
    if (tooltipX < matrixLeft + padding) {
      tooltipX = x + 15;
    }

    // If too close to right edge, show to left
    if (tooltipX + tooltipWidth > matrixRight - padding) {
      tooltipX = x - tooltipWidth - 15;
    }

    // Ensure within SVG bounds
    tooltipX = Math.max(matrixLeft + padding, Math.min(matrixRight - tooltipWidth - padding, tooltipX));
    tooltipY = Math.max(matrixTop + padding, Math.min(matrixBottom - tooltipHeight - padding, tooltipY));

    return { x: tooltipX, y: tooltipY };
  };

  // Copy experiment to clipboard
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

  // Keyboard and click handlers
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedAssumption(null);
      setHoveredId(null);
      setLockedTooltipId(null);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Close tooltip if clicking outside of it
    if (!target.closest('[data-tooltip]') && !target.closest('circle')) {
      setLockedTooltipId(null);
    }
  };

  // Add event listeners
  useState(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    document.addEventListener("click", handleClickOutside as any);
    return () => {
      document.removeEventListener("keydown", handleKeyDown as any);
      document.removeEventListener("click", handleClickOutside as any);
    };
  });

  useEffect(() => {
    const backdrop = document.querySelector('div[data-overlay]');
  
    if (backdrop) {
      // Disable backdrop intercepting clicks only while tooltip is locked open
      backdrop.style.pointerEvents = lockedTooltipId ? "none" : "auto";
    }
  }, [lockedTooltipId]);
  
  return (
    <>
  <div className="relative flex justify-center items-center w-full mx-auto" style={{ zIndex: 10 }}>   
  <svg 
  width="100%" 
  height="100%" 
  viewBox="50 20 750 730"
  preserveAspectRatio="xMidYMid meet"
  className="w-full h-auto min-h-[500px] xl:min-h-0"
  style={{ overflow: "visible", position: "relative", zIndex: 10 }}
>
          {/* Background */}
          <rect x="100" y="50" width="650" height="650" fill="#FAFAFA" rx="8" />

          {/* Test Now quadrant highlight (top-right) */}
          <rect x="425" y="50" width="325" height="325" fill="#10B981" opacity="0.05" rx="4" />
          <rect
            x="425"
            y="50"
            width="325"
            height="325"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            opacity="0.3"
            rx="4"
          />

          {/* Grid lines */}
          <line x1="425" y1="50" x2="425" y2="700" stroke="#D1D5DB" strokeWidth="2" />
          <line x1="100" y1="375" x2="750" y2="375" stroke="#D1D5DB" strokeWidth="2" />

          {/* Axis labels */}
          {/* Y-axis labels - VERTICAL (outside matrix on left) */}
          <text
            x="50"
            y="212"
            textAnchor="middle"
            className="text-xs xl:text-sm"
            fontWeight="500"
            fill="#374151"
            transform="rotate(-90 50 212)"
          >
            High Risk if Wrong →
          </text>
          <text
            x="50"
            y="537"
            textAnchor="middle"
            className="text-xs xl:text-sm"
            fontWeight="500"
            fill="#374151"
            transform="rotate(-90 50 537)"
          >
            ← Low Risk if Wrong
          </text>

          {/* X-axis labels - closer to matrix */}
          <text x="100" y="725" textAnchor="start" className="text-xs xl:text-sm" fontWeight="500" fill="#374151">
            ← Hard to Test
          </text>
          <text x="750" y="725" textAnchor="end" className="text-xs xl:text-sm" fontWeight="500" fill="#374151">
            Easy to Test →
          </text>

          {/* Quadrant labels - ALL OUTSIDE matrix with more spacing from X-axis */}
          {/* TOP-LEFT: Critical Risk - RED */}
<text x="100" y="30" textAnchor="start" className="text-base xl:text-xl" fontWeight="700" fill="#EF4444">
  Critical Risk
</text>

{/* TOP-RIGHT: Test Now - GREEN */}
<text x="750" y="30" textAnchor="end" className="text-base xl:text-xl" fontWeight="700" fill="#10B981">
  Test Now
</text>

{/* BOTTOM-LEFT: Defer / Monitor - BLUE */}
<text x="100" y="770" textAnchor="start" className="text-base xl:text-xl" fontWeight="700" fill="#3B82F6">
  Defer / Monitor
</text>

{/* BOTTOM-RIGHT: Quick Wins - YELLOW */}
<text x="750" y="770" textAnchor="end" className="text-base xl:text-xl" fontWeight="700" fill="#F59E0B">
  Quick Wins
</text>
          {/* Plot assumptions */}
          {assumptions.map((assumption, index) => {
            // Add padding to keep dots inside viewBox
const dotRadius = 8; // Match your circle radius
const minX = matrixLeft + dotRadius + 10; // Left boundary + padding
const maxX = matrixRight - dotRadius - 10; // Right boundary - padding
const minY = matrixTop + dotRadius + 10; // Top boundary + padding
const maxY = matrixBottom - dotRadius - 10; // Bottom boundary - padding

// Calculate position with constraints
const rawX = getTestabilityX(assumption.testability);
const rawY = getRiskY(assumption.risk);

// Add small random offset to prevent perfect overlaps
// Stable jitter based on assumption ID (prevents dots from moving on hover)
const seed = assumption.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
const jitterX = ((seed % 30) - 15); // ±15px based on ID
const jitterY = (((seed * 7) % 30) - 15); // Different multiplier for Y to avoid patterns

// Clamp values to stay within bounds
const x = Math.max(minX, Math.min(maxX, rawX + jitterX));
const y = Math.max(minY, Math.min(maxY, rawY + jitterY));
            const color = assumption.isHiddenBlindSpot ? "#EF4444" : "#10B981";
            const isHovered = hoveredId === assumption.id;
            const isTooltipVisible = lockedTooltipId === assumption.id;
            const isOtherHovered = (hoveredId !== null && !isHovered) || (lockedTooltipId !== null && !isTooltipVisible);
            const labelPos = getLabelPosition(index, x, y);

            return (
              <g
                key={assumption.id}
                style={{
                  opacity: isOtherHovered ? 0.15 : 1,
                  transition: "opacity 0.3s ease, transform 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => {
                  setHoveredId(assumption.id);
                  setLockedTooltipId(assumption.id);
                }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedAssumption(assumption)}
              >
                {/* Pulsing glow for blind spots */}
                {assumption.isHiddenBlindSpot && (
                  <circle cx={x} cy={y} r="12" fill={color} opacity="0.3">
                    <animate attributeName="r" from="10" to="18" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Main dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 12 : 10}
                  fill={color}
                  opacity="0.9"
                  filter={isHovered ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : ""}
                  style={{ transition: "all 0.2s ease" }}
                />

                {/* Label with white background and shadow */}
                <rect
                  x={labelPos.anchor === "start" ? x + labelPos.dx : x + labelPos.dx - 90}
                  y={y + labelPos.dy - 11}
                  width="90"
                  height="20"
                  fill="white"
                  opacity="0.95"
                  rx="3"
                  filter="drop-shadow(0 1px 3px rgba(0,0,0,0.1))"
                />
                <text
                  x={x + labelPos.dx}
                  y={y + labelPos.dy}
                  textAnchor={labelPos.anchor as any}
                  fontSize="14"
                  fill="#374151"
                  fontWeight="500"
                  style={{ pointerEvents: "none" }}
                >
                  {truncate(assumption.text, 20)}
                </text>

                {/* Locked tooltip with smart positioning */}
                {isTooltipVisible &&
                  (() => {
                    const tooltipPos = getTooltipPosition(x, y);
                    const riskInfo = getRiskInfo(assumption.risk);
                    const testInfo = getTestabilityInfo(assumption.testability);

                    return (
                      <g style={{ zIndex: 10000 }}>
                      <foreignObject
                        x={tooltipPos.x}
                        y={tooltipPos.y}
                        width="320"
                        height="220"
                        style={{
                          pointerEvents: "auto",
                          position: "relative",
                          zIndex: 99999
                        }}
                      > 
 
                          <div
                            data-tooltip
                            className="rounded-lg p-4 border border-gray-200 animate-fade-in cursor-pointer hover:bg-gray-50 transition-colors"
                            style={{
                              zIndex: 99999,
                              position: 'relative',
                              backgroundColor: "#FFFFFF",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                              pointerEvents: 'auto',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAssumption(assumption);
                              setLockedTooltipId(null);
                            }}
                          >
                            <div className="text-sm font-semibold text-gray-900 mb-3 leading-relaxed">
                              {assumption.text}
                            </div>
                            <div className="text-sm space-y-2 text-gray-700">
                              <div>
                                <span className="font-medium">Risk:</span> {assumption.risk}/10 {riskInfo.emoji}{" "}
                                {riskInfo.level}
                              </div>
                              <div>
                                <span className="font-medium">Testability:</span> {assumption.testability}/10{" "}
                                {testInfo.emoji} {testInfo.level}
                              </div>
                              {assumption.isHiddenBlindSpot && (
                                <div className="mt-2 text-red-600 font-semibold text-sm">🚨 Hidden Blind Spot</div>
                              )}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 text-blue-600 font-medium text-sm">
                              → Click for experiment details
                            </div>
                          </div>
                        </foreignObject>
                      </g>
                    );
                  })()}
              </g>
            );
          })}

          {/* Border */}
          <rect x="100" y="50" width="650" height="650" fill="none" stroke="#D1D5DB" strokeWidth="2" rx="8" />
        </svg>
      </div>

      {/* Invisible blocking overlay when tooltip is open */}
      {lockedTooltipId && (
        <div
          className="fixed inset-0"
          style={{ 
            zIndex: 9998,
            background: 'transparent',
            cursor: 'default',
            pointerEvents: lockedTooltipId ? 'none' : 'auto',
          }}
          onClick={() => setLockedTooltipId(null)}
        />
      )}

  
  <Sheet 
    open={selectedAssumption !== null} 
    onOpenChange={(open) => !open && setSelectedAssumption(null)}
    modal={true}
  >
    <SheetContent 
      className="w-full sm:w-[400px] overflow-y-auto"
      style={{ zIndex: 10000 }}
    >
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

                {/* Experiment Section */}
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

{/* Why This Matters */}
<div>
  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
    💡 Why This Matters
  </h3>
  <div className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
  {(() => {
    // Determine quadrant based on risk and testability
    const isHighRisk = selectedAssumption.risk >= 7;
    const isHighTestability = selectedAssumption.testability >= 8;
    
    if (isHighRisk && isHighTestability) {
      // Test Now quadrant (top-right)
      return "This is both critical AND easy to test - your top priority. Test this immediately before building anything else. A quick validation here could save you months of wasted effort.";
    } else if (isHighRisk && !isHighTestability) {
      // Critical Risk quadrant (top-left)
      return "This is a critical assumption that's expensive or time-consuming to validate. If this is wrong, your business model fails - but testing it properly requires significant investment. Consider if there's a cheaper proxy test, or if this risk is acceptable.";
    } else if (!isHighRisk && isHighTestability) {
      // Quick Wins quadrant (bottom-right)
      return "This is a low-risk assumption that's cheap and easy to validate. While not make-or-break, testing it quickly will help you optimize your approach and build confidence with stakeholders.";
    } else {
      // Defer/Monitor quadrant (bottom-left)
      return "This assumption has lower impact and is harder to test. Consider deferring validation until you've tested your critical assumptions, or finding a simpler proxy test that gives directional signal.";
    }
  })()}
</div>
</div>
</div> {/* closes experiment section wrapper */}
</>
)}
</SheetContent>
</Sheet>
</>
);
};

export default AnalysisMatrix;
    