const MatrixPreview = () => {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="400" fill="white" rx="8" />
      
      {/* Grid lines */}
      <line x1="200" y1="40" x2="200" y2="360" stroke="#E5E7EB" strokeWidth="2" />
      <line x1="40" y1="200" x2="360" y2="200" stroke="#E5E7EB" strokeWidth="2" />
      
      {/* Axis labels */}
      <text x="200" y="30" textAnchor="middle" fontSize="14" fontWeight="600" fill="#6B7280">
        Risk if Wrong
      </text>
      <text x="370" y="205" textAnchor="end" fontSize="14" fontWeight="600" fill="#6B7280">
        Easy to Test
      </text>
      
      {/* Quadrant labels */}
      <text x="120" y="120" textAnchor="middle" fontSize="12" fill="#9CA3AF">
        Low Risk
      </text>
      <text x="280" y="120" textAnchor="middle" fontSize="12" fill="#9CA3AF">
        Test Later
      </text>
      <text x="120" y="280" textAnchor="middle" fontSize="12" fill="#9CA3AF">
        Test Now
      </text>
      <text x="280" y="280" textAnchor="middle" fontSize="12" fill="#9CA3AF">
        Critical Risk
      </text>
      
      {/* Data points */}
      {/* Green dots - verified assumptions */}
      <circle cx="100" cy="100" r="8" fill="#10B981" opacity="0.8" />
      <circle cx="130" cy="110" r="8" fill="#10B981" opacity="0.8" />
      
      {/* Blue dots - needs research */}
      <circle cx="270" cy="110" r="8" fill="#3B82F6" opacity="0.8" />
      <circle cx="290" cy="130" r="8" fill="#3B82F6" opacity="0.8" />
      
      {/* Yellow dots - test soon */}
      <circle cx="110" cy="270" r="8" fill="#F59E0B" opacity="0.8" />
      <circle cx="140" cy="290" r="8" fill="#F59E0B" opacity="0.8" />
      
      {/* Red dots - critical risk */}
      <circle cx="280" cy="280" r="10" fill="#EF4444" opacity="0.8" />
      <circle cx="310" cy="300" r="10" fill="#EF4444" opacity="0.8" />
      
      {/* Border */}
      <rect width="400" height="400" fill="none" stroke="#E5E7EB" strokeWidth="2" rx="8" />
    </svg>
  );
};

export default MatrixPreview;
