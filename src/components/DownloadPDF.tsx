import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, Loader2 } from "lucide-react";
import { Assumption } from "@/types/assumption";

interface DownloadPDFProps {
  assumptions: Assumption[];
  userInput: string;
  firstPrinciplesInsight?: string;
}

const getQuadrant = (a: Assumption): string => {
  const isHighRisk = a.risk >= 7;
  const isHighTestability = a.testability >= 8;
  if (isHighRisk && isHighTestability) return "testNow";
  if (isHighRisk && !isHighTestability) return "criticalRisk";
  if (!isHighRisk && isHighTestability) return "quickWins";
  return "defer";
};

const quadrantConfig: Record<string, { title: string; emoji: string; subtitle: string; color: [number, number, number]; bgColor: [number, number, number] }> = {
  testNow: {
    title: "TEST NOW",
    emoji: "🎯",
    subtitle: "Validate these FIRST before building anything",
    color: [22, 101, 52],
    bgColor: [220, 252, 231],
  },
  criticalRisk: {
    title: "CRITICAL RISK",
    emoji: "⚠️",
    subtitle: "High stakes, hard to test. Plan carefully.",
    color: [153, 27, 27],
    bgColor: [254, 226, 226],
  },
  quickWins: {
    title: "QUICK WINS",
    emoji: "✅",
    subtitle: "Easy validations, do these alongside Test Now",
    color: [133, 100, 4],
    bgColor: [254, 249, 195],
  },
  defer: {
    title: "DEFER / MONITOR",
    emoji: "📊",
    subtitle: "Lower priority, revisit after critical assumptions",
    color: [30, 64, 175],
    bgColor: [219, 234, 254],
  },
};

const DownloadPDF = ({ assumptions, userInput, firstPrinciplesInsight }: DownloadPDFProps) => {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      // Dynamic import jsPDF
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Helper: check if we need a new page
      const checkPage = (needed: number) => {
        if (y + needed > pageHeight - 20) {
          doc.addPage();
          y = margin;
        }
      };

      // Helper: draw rounded rectangle
      const drawRoundedRect = (
        x: number, y: number, w: number, h: number,
        r: number, fillColor: [number, number, number],
        borderColor?: [number, number, number]
      ) => {
        doc.setFillColor(...fillColor);
        if (borderColor) {
          doc.setDrawColor(...borderColor);
          doc.setLineWidth(0.3);
        }
        doc.roundedRect(x, y, w, h, r, r, borderColor ? "FD" : "F");
      };

      // ============================
      // HEADER
      // ============================
      drawRoundedRect(margin, y, contentWidth, 28, 3, [245, 243, 255]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(88, 28, 135);
      doc.text("Blindspot Spotter", margin + 6, y + 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text("AI-Powered Assumption Validation", margin + 6, y + 19);
      doc.text(today, pageWidth - margin - 6, y + 12, { align: "right" });
      y += 34;

      // ============================
      // PRODUCT IDEA
      // ============================
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      doc.text("PRODUCT IDEA", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);
      const ideaLines = doc.splitTextToSize(userInput, contentWidth - 4);
      doc.text(ideaLines, margin + 2, y);
      y += ideaLines.length * 5 + 4;

      // ============================
      // FIRST PRINCIPLES INSIGHT
      // ============================
      if (firstPrinciplesInsight) {
        checkPage(25);
        drawRoundedRect(margin, y, contentWidth, 0, 3, [243, 232, 255]); // placeholder height
        // Calculate actual height
        doc.setFontSize(9);
        const insightLines = doc.splitTextToSize(firstPrinciplesInsight, contentWidth - 16);
        const insightBoxHeight = 10 + insightLines.length * 4.5 + 4;
        // Redraw with correct height
        drawRoundedRect(margin, y, contentWidth, insightBoxHeight, 3, [243, 232, 255], [192, 170, 230]);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(88, 28, 135);
        doc.text("First Principles Insight", margin + 6, y + 7);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(55, 65, 81);
        doc.text(insightLines, margin + 6, y + 13);
        y += insightBoxHeight + 6;
      }

      // ============================
      // SUMMARY STATS
      // ============================
      checkPage(20);
      const blindSpotCount = assumptions.filter((a) => a.isHiddenBlindSpot).length;
      const grouped = {
        testNow: assumptions.filter((a) => getQuadrant(a) === "testNow"),
        criticalRisk: assumptions.filter((a) => getQuadrant(a) === "criticalRisk"),
        quickWins: assumptions.filter((a) => getQuadrant(a) === "quickWins"),
        defer: assumptions.filter((a) => getQuadrant(a) === "defer"),
      };

      // Stats row
      const statBoxWidth = (contentWidth - 9) / 4;
      const stats = [
        { label: "Total", value: String(assumptions.length), color: [59, 130, 246] as [number, number, number] },
        { label: "Test Now", value: String(grouped.testNow.length), color: [22, 163, 74] as [number, number, number] },
        { label: "Critical", value: String(grouped.criticalRisk.length), color: [220, 38, 38] as [number, number, number] },
        { label: "Blind Spots", value: String(blindSpotCount), color: [220, 38, 38] as [number, number, number] },
      ];

      stats.forEach((stat, i) => {
        const x = margin + i * (statBoxWidth + 3);
        drawRoundedRect(x, y, statBoxWidth, 16, 2, [249, 250, 251]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...stat.color);
        doc.text(stat.value, x + statBoxWidth / 2, y + 9, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(107, 114, 128);
        doc.text(stat.label, x + statBoxWidth / 2, y + 14, { align: "center" });
      });
      y += 22;

      // ============================
      // QUADRANT SECTIONS
      // ============================
      const quadrantOrder = ["testNow", "criticalRisk", "quickWins", "defer"] as const;

      for (const quadrantKey of quadrantOrder) {
        const items = grouped[quadrantKey];
        if (items.length === 0) continue;

        const config = quadrantConfig[quadrantKey];

        // Section header
        checkPage(20);
        drawRoundedRect(margin, y, contentWidth, 10, 2, config.bgColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...config.color);
        doc.text(`${config.emoji}  ${config.title}`, margin + 4, y + 7);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.text(`— ${config.subtitle}`, margin + 4 + doc.getTextWidth(`${config.emoji}  ${config.title}`) + 3, y + 7);
        y += 14;

        // Individual assumptions
        for (const assumption of items) {
          // Estimate card height
          doc.setFontSize(9);
          const textLines = doc.splitTextToSize(assumption.text, contentWidth - 16);
          const methodLines = doc.splitTextToSize(assumption.experiment.method, contentWidth - 24);
          const cardHeight = 12 + textLines.length * 4.5 + 6 + 6 + methodLines.length * 4 + 10;

          checkPage(cardHeight + 4);

          // Card background
          drawRoundedRect(margin + 2, y, contentWidth - 4, cardHeight, 2, [255, 255, 255], [229, 231, 235]);

          let cardY = y + 5;

          // Assumption text
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(17, 24, 39);
          doc.text(textLines, margin + 8, cardY);
          cardY += textLines.length * 4.5 + 1;

          // Blind spot badge
          if (assumption.isHiddenBlindSpot) {
            drawRoundedRect(margin + 8, cardY - 1, 38, 5, 1, [254, 226, 226]);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(6.5);
            doc.setTextColor(153, 27, 27);
            doc.text("Hidden Blind Spot", margin + 10, cardY + 3);
            cardY += 7;
          }

          // Risk / Testability scores
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);

          // Risk
          const riskColor: [number, number, number] = assumption.risk >= 8 ? [220, 38, 38] : assumption.risk >= 5 ? [202, 138, 4] : [22, 163, 74];
          doc.setTextColor(107, 114, 128);
          doc.text("Risk: ", margin + 8, cardY);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...riskColor);
          doc.text(`${assumption.risk}/10`, margin + 8 + doc.getTextWidth("Risk: "), cardY);

          // Testability
          const testColor: [number, number, number] = assumption.testability >= 8 ? [22, 163, 74] : assumption.testability >= 5 ? [202, 138, 4] : [220, 38, 38];
          const testX = margin + 45;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(107, 114, 128);
          doc.text("Testability: ", testX, cardY);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...testColor);
          doc.text(`${assumption.testability}/10`, testX + doc.getTextWidth("Testability: "), cardY);
          cardY += 6;

          // Experiment section
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(30, 64, 175);
          doc.text(`Experiment: ${assumption.experiment.name}`, margin + 8, cardY);
          cardY += 4.5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(55, 65, 81);
          doc.text(methodLines, margin + 8, cardY);
          cardY += methodLines.length * 4;

          // Cost and Time
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(107, 114, 128);
          doc.text(`Cost: ${assumption.experiment.cost}  |  Time: ${assumption.experiment.timeframe}`, margin + 8, cardY);

          y += cardHeight + 3;
        }

        y += 4;
      }

      // ============================
      // FOOTER - NEXT STEPS
      // ============================
      checkPage(30);
      drawRoundedRect(margin, y, contentWidth, 22, 3, [239, 246, 255], [147, 197, 253]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 64, 175);
      doc.text("Next Step", margin + 6, y + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      doc.text(
        "Start with your TEST NOW assumptions. These are high risk AND easy to validate — no excuse to skip them.",
        margin + 6,
        y + 14
      );
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text("Generated by Blindspot Spotter  •  blindspot-spotter.vercel.app", margin + 6, y + 19);

      // Save
      const filename = `blindspot-analysis-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);

      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      disabled={downloading}
      className="text-xs h-8 px-3 text-muted-foreground hover:text-foreground"
    >
      {done ? (
        <>
          <Check className="w-3.5 h-3.5 mr-1.5" />
          ✅ Downloaded!
        </>
      ) : downloading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          📄 Download PDF
        </>
      )}
    </Button>
  );
};

export default DownloadPDF;
