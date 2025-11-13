const MatrixPreview = () => {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="400" fill="#FAFAFA" rx="8" />
      
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
      
      {/* Test Now quadrant highlight (top-right) */}
      <rect x="200" y="50" width="150" height="150" fill="#10B981" opacity="0.05" rx="4" />
      <rect x="200" y="50" width="150" height="150" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.3" rx="4" />
      
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
      
      {/* Data points with labels */}
      {/* TOP-LEFT: Critical Risk (High Risk, Hard to Test) - RED */}
      <circle cx="120" cy="130" r="8" fill="#EF4444" opacity="0.9" />
      <text x="120" y="155" textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">Regulations</text>
      
      <circle cx="110" cy="165" r="7" fill="#EF4444" opacity="0.9" />
      <text x="110" y="185" textAnchor="middle" fontSize="8" fill="#374151">Insurance</text>
      
      {/* TOP-RIGHT: Test Now (High Risk, Easy to Test) - GREEN */}
      <circle cx="280" cy="120" r="8" fill="#10B981" opacity="0.9" />
      <text x="280" y="145" textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">Market size</text>
      
      <circle cx="310" cy="140" r="8" fill="#10B981" opacity="0.9" />
      <text x="310" y="165" textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">Trust</text>
      
      <circle cx="260" cy="165" r="7" fill="#10B981" opacity="0.9" />
      <text x="260" y="185" textAnchor="middle" fontSize="8" fill="#374151">Will pay</text>
      
      {/* BOTTOM-LEFT: Defer / Monitor (Low Risk, Hard to Test) - BLUE */}
      <circle cx="120" cy="260" r="7" fill="#3B82F6" opacity="0.9" />
      <text x="120" y="280" textAnchor="middle" fontSize="9" fill="#374151">Brand</text>
      
      {/* BOTTOM-RIGHT: Quick Wins (Low Risk, Easy to Test) - YELLOW */}
      <circle cx="280" cy="240" r="7" fill="#F59E0B" opacity="0.9" />
      <text x="280" y="260" textAnchor="middle" fontSize="9" fill="#374151">Pricing</text>
      
      <circle cx="300" cy="270" r="7" fill="#F59E0B" opacity="0.9" />
      <text x="300" y="290" textAnchor="middle" fontSize="9" fill="#374151">Features</text>
      
      <circle cx="260" cy="290" r="7" fill="#F59E0B" opacity="0.9" />
      <text x="260" y="310" textAnchor="middle" fontSize="9" fill="#374151">UI/UX</text>
      
      {/* Border */}
      <rect width="400" height="400" fill="none" stroke="#D1D5DB" strokeWidth="2" rx="8" />
    </svg>
  );
};

export default MatrixPreview;
