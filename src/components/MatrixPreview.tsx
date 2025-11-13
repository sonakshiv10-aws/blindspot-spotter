const MatrixPreview = () => {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="400" fill="#FAFAFA" rx="8" />
      
      {/* Grid lines */}
      <line x1="200" y1="50" x2="200" y2="350" stroke="#D1D5DB" strokeWidth="2" />
      <line x1="50" y1="200" x2="350" y2="200" stroke="#D1D5DB" strokeWidth="2" />
      
      {/* Axis labels */}
      <text x="200" y="35" textAnchor="middle" fontSize="13" fontWeight="600" fill="#6B7280">
        Risk if Wrong →
      </text>
      <text x="365" y="205" textAnchor="end" fontSize="13" fontWeight="600" fill="#6B7280">
        Easy to Test →
      </text>
      
      {/* Quadrant labels */}
      <text x="125" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#10B981">
        Quick Wins
      </text>
      <text x="275" y="100" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3B82F6">
        Defer / Monitor
      </text>
      <text x="125" y="300" textAnchor="middle" fontSize="11" fontWeight="600" fill="#F59E0B">
        Test Now
      </text>
      <text x="275" y="300" textAnchor="middle" fontSize="11" fontWeight="600" fill="#EF4444">
        Critical Risk
      </text>
      
      {/* Data points with labels */}
      {/* Green dots - Quick wins */}
      <circle cx="100" cy="120" r="7" fill="#10B981" opacity="0.9" />
      <text x="100" y="145" textAnchor="middle" fontSize="9" fill="#374151">Trust</text>
      
      <circle cx="140" cy="130" r="7" fill="#10B981" opacity="0.9" />
      <text x="140" y="155" textAnchor="middle" fontSize="9" fill="#374151">UI/UX</text>
      
      {/* Blue dots - Defer */}
      <circle cx="280" cy="120" r="7" fill="#3B82F6" opacity="0.9" />
      <text x="280" y="145" textAnchor="middle" fontSize="9" fill="#374151">Brand</text>
      
      {/* Yellow dots - Test now */}
      <circle cx="110" cy="260" r="7" fill="#F59E0B" opacity="0.9" />
      <text x="110" y="285" textAnchor="middle" fontSize="9" fill="#374151">Pricing</text>
      
      <circle cx="150" cy="280" r="7" fill="#F59E0B" opacity="0.9" />
      <text x="150" y="305" textAnchor="middle" fontSize="9" fill="#374151">Features</text>
      
      {/* Red dots - Critical risk */}
      <circle cx="270" cy="270" r="9" fill="#EF4444" opacity="0.9" />
      <text x="270" y="295" textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">Market size</text>
      
      <circle cx="310" cy="290" r="9" fill="#EF4444" opacity="0.9" />
      <text x="310" y="315" textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">Unit econ</text>
      
      <circle cx="240" cy="250" r="9" fill="#EF4444" opacity="0.9" />
      <text x="240" y="275" textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">Regulations</text>
      
      {/* Border */}
      <rect width="400" height="400" fill="none" stroke="#D1D5DB" strokeWidth="2" rx="8" />
    </svg>
  );
};

export default MatrixPreview;
