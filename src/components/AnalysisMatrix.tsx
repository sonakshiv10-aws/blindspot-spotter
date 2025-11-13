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
  // Map risk (1-10) to Y position (350 to 50, inverted because SVG Y goes down)
  const getRiskY = (risk: number) => 350 - ((risk - 1) / 9) * 300;
  
  // Map testability (1-10) to X position (50 to 350)
  const getTestabilityX = (testability: number) => 50 + ((testability - 1) / 9) * 300;
  
  // Truncate text if too long
  const truncate = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  return (
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
        
        return (
          <g key={assumption.id}>
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
            <circle cx={x} cy={y} r="8" fill={color} opacity="0.9" />
            
            {/* Label - position to avoid overlap */}
            <text 
              x={x} 
              y={y - 15} 
              textAnchor="middle" 
              fontSize="8" 
              fill="#374151" 
              fontWeight="600"
            >
              {truncate(assumption.text, 15)}
            </text>
          </g>
        );
      })}
      
      {/* Border */}
      <rect width="400" height="400" fill="none" stroke="#D1D5DB" strokeWidth="2" rx="8" />
    </svg>
  );
};

export default AnalysisMatrix;
