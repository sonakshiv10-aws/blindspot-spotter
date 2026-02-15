import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Assumption } from "@/types/assumption";

interface CopyFullAnalysisProps {
  assumptions: Assumption[];
  userInput: string;
}

const getQuadrant = (a: Assumption): string => {
  const isHighRisk = a.risk >= 7;
  const isHighTestability = a.testability >= 8;
  if (isHighRisk && isHighTestability) return "testNow";
  if (isHighRisk && !isHighTestability) return "criticalRisk";
  if (!isHighRisk && isHighTestability) return "quickWins";
  return "defer";
};

const formatAssumption = (a: Assumption): string => {
  const blindSpot = a.isHiddenBlindSpot ? " 🚨 Hidden Blind Spot" : "";
  return `- ${a.text}
  Risk: ${a.risk}/10 | Testability: ${a.testability}/10${blindSpot}
  Experiment: ${a.experiment.name}
  How: ${a.experiment.method}
  Cost: ${a.experiment.cost} | Time: ${a.experiment.timeframe}`;
};

const CopyFullAnalysis = ({ assumptions, userInput }: CopyFullAnalysisProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const grouped = {
      testNow: assumptions.filter(a => getQuadrant(a) === "testNow"),
      criticalRisk: assumptions.filter(a => getQuadrant(a) === "criticalRisk"),
      quickWins: assumptions.filter(a => getQuadrant(a) === "quickWins"),
      defer: assumptions.filter(a => getQuadrant(a) === "defer"),
    };

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const sections: string[] = [];

    if (grouped.testNow.length > 0) {
      sections.push(
        `🎯 TEST NOW — Validate these FIRST before building anything\n\n${grouped.testNow.map(formatAssumption).join("\n\n")}`
      );
    }
    if (grouped.criticalRisk.length > 0) {
      sections.push(
        `⚠️ CRITICAL RISK — High stakes, hard to test. Plan carefully.\n\n${grouped.criticalRisk.map(formatAssumption).join("\n\n")}`
      );
    }
    if (grouped.quickWins.length > 0) {
      sections.push(
        `✅ QUICK WINS — Easy validations, do these alongside Test Now\n\n${grouped.quickWins.map(formatAssumption).join("\n\n")}`
      );
    }
    if (grouped.defer.length > 0) {
      sections.push(
        `📊 DEFER / MONITOR — Lower priority, revisit after critical assumptions\n\n${grouped.defer.map(formatAssumption).join("\n\n")}`
      );
    }

    const text = `BLINDSPOT SPOTTER ANALYSIS

${userInput}

Generated: ${today}

========================

${sections.join("\n\n")}

========================

🔑 NEXT STEP: Start with your TEST NOW assumptions.
These are high risk AND easy to validate - no excuse to skip them.

🔗 Run your own analysis: https://blindspot-spotter.vercel.app

========================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="text-xs h-8 px-3 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1.5" />
          ✅ Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          📋 Copy Full Analysis
        </>
      )}
    </Button>
  );
};

export default CopyFullAnalysis;
