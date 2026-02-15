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

const DownloadPDF = ({ assumptions, userInput, firstPrinciplesInsight }: DownloadPDFProps) => {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.default;

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

      const checkPage = (needed: number) => {
        if (y + needed > pageHeight - 20) {
          doc.addPage();
          y = margin;
        }
      };

      // HEADER
      doc.setFillColor(245, 243, 255);
      doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");
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

      // PRODUCT IDEA
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

      // FIRST PRINCIPLES INSIGHT
      if (firstPrinciplesInsight) {
        checkPage(25);
        doc.setFontSize(9);
        const insightLines = doc.splitTextToSize(firstPrinciplesInsight, contentWidth - 16);
        const insightBoxHeight = 10 + insightLines.length * 4.5 + 4;
        doc.setFillColor(243, 232, 255);
        doc.setDrawColor(192, 170, 230);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentWidth, insightBoxHeight, 3, 3, "FD");
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

      // SUMMARY STATS
      checkPage(20);
      const blindSpotCount = assumptions.filter(function(a) { return a.isHiddenBlindSpot; }).length;
      const grouped = {
        testNow: assumptions.filter(function(a) { return getQuadrant(a) === "testNow"; }),
        criticalRisk: assumptions.filter(function(a) { return getQuadrant(a) === "criticalRisk"; }),
        quickWins: assumptions.filter(function(a) { return getQuadrant(a) === "quickWins"; }),
        defer: assumptions.filter(function(a) { return getQuadrant(a) === "defer"; }),
      };

      const statBoxWidth = (contentWidth - 9) / 4;
      const statsData = [
        { label: "Total", value: String(assumptions.length), r: 59, g: 130, b: 246 },
        { label: "Test Now", value: String(grouped.testNow.length), r: 22, g: 163, b: 74 },
        { label: "Critical", value: String(grouped.criticalRisk.length), r: 220, g: 38, b: 38 },
        { label: "Blind Spots", value: String(blindSpotCount), r: 220, g: 38, b: 38 },
      ];

      for (var i = 0; i < statsData.length; i++) {
        var stat = statsData[i];
        var x = margin + i * (statBoxWidth + 3);
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(x, y, statBoxWidth, 16, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(stat.r, stat.g, stat.b);
        doc.text(stat.value, x + statBoxWidth / 2, y + 9, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(107, 114, 128);
        doc.text(stat.label, x + statBoxWidth / 2, y + 14, { align: "center" });
      }
      y += 22;

      // QUADRANT SECTIONS
      var quadrantsList = [
        { key: "testNow", title: "TEST NOW", subtitle: "Validate these FIRST", items: grouped.testNow, titleR: 22, titleG: 101, titleB: 52, bgR: 220, bgG: 252, bgB: 231 },
        { key: "criticalRisk", title: "CRITICAL RISK", subtitle: "High stakes, plan carefully", items: grouped.criticalRisk, titleR: 153, titleG: 27, titleB: 27, bgR: 254, bgG: 226, bgB: 226 },
        { key: "quickWins", title: "QUICK WINS", subtitle: "Easy validations", items: grouped.quickWins, titleR: 133, titleG: 100, titleB: 4, bgR: 254, bgG: 249, bgB: 195 },
        { key: "defer", title: "DEFER / MONITOR", subtitle: "Lower priority", items: grouped.defer, titleR: 30, titleG: 64, titleB: 175, bgR: 219, bgG: 234, bgB: 254 },
      ];

      for (var qi = 0; qi < quadrantsList.length; qi++) {
        var q = quadrantsList[qi];
        if (q.items.length === 0) continue;

        checkPage(70);
        doc.setFillColor(q.bgR, q.bgG, q.bgB);
        doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(q.titleR, q.titleG, q.titleB);
        doc.text(q.title + " -- " + q.subtitle, margin + 4, y + 7);
        y += 14;

        for (var ai = 0; ai < q.items.length; ai++) {
          var assumption = q.items[ai];
          doc.setFontSize(9);
          var textLines = doc.splitTextToSize(assumption.text, contentWidth - 20);
          var methodLines = doc.splitTextToSize(assumption.experiment.method, contentWidth - 20);
          var blindSpotExtra = assumption.isHiddenBlindSpot ? 7 : 0;
          var cardHeight = 14 + textLines.length * 4.5 + blindSpotExtra + 6 + 6 + methodLines.length * 4 + 12;

          checkPage(cardHeight + 4);

          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(229, 231, 235);
          doc.setLineWidth(0.3);
          doc.roundedRect(margin + 2, y, contentWidth - 4, cardHeight, 2, 2, "FD");

          var cardY = y + 5;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(17, 24, 39);
          doc.text(textLines, margin + 8, cardY);
          cardY += textLines.length * 4.5 + 1;

          if (assumption.isHiddenBlindSpot) {
            doc.setFillColor(254, 226, 226);
            doc.roundedRect(margin + 8, cardY - 1, 38, 5, 1, 1, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(6.5);
            doc.setTextColor(153, 27, 27);
            doc.text("Hidden Blind Spot", margin + 10, cardY + 3);
            cardY += 7;
          }

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(107, 114, 128);
          doc.text("Risk: ", margin + 8, cardY);
          var riskR = assumption.risk >= 8 ? 220 : assumption.risk >= 5 ? 202 : 22;
          var riskG = assumption.risk >= 8 ? 38 : assumption.risk >= 5 ? 138 : 163;
          var riskB = assumption.risk >= 8 ? 38 : assumption.risk >= 5 ? 4 : 74;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(riskR, riskG, riskB);
          doc.text(assumption.risk + "/10", margin + 8 + doc.getTextWidth("Risk: "), cardY);

          var testX = margin + 45;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(107, 114, 128);
          doc.text("Testability: ", testX, cardY);
          var testR = assumption.testability >= 8 ? 22 : assumption.testability >= 5 ? 202 : 220;
          var testG = assumption.testability >= 8 ? 163 : assumption.testability >= 5 ? 138 : 38;
          var testB = assumption.testability >= 8 ? 74 : assumption.testability >= 5 ? 4 : 38;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(testR, testG, testB);
          doc.text(assumption.testability + "/10", testX + doc.getTextWidth("Testability: "), cardY);
          cardY += 6;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(30, 64, 175);
          doc.text("Experiment: " + assumption.experiment.name, margin + 8, cardY);
          cardY += 4.5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(55, 65, 81);
          doc.text(methodLines, margin + 8, cardY);
          cardY += methodLines.length * 4;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(107, 114, 128);
          var costTimeText = "Cost: " + assumption.experiment.cost + "  |  Time: " + assumption.experiment.timeframe;
          var costTimeLines = doc.splitTextToSize(costTimeText, contentWidth - 20);
          doc.text(costTimeLines, margin + 8, cardY);

          y += cardHeight + 3;
        }

        y += 4;
      }

      // FOOTER
      checkPage(30);
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(147, 197, 253);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 64, 175);
      doc.text("Next Step", margin + 6, y + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      doc.text(
        "Start with your TEST NOW assumptions. High risk AND easy to validate.",
        margin + 6,
        y + 14
      );
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text("Generated by Blindspot Spotter  |  blindspot-spotter.vercel.app", margin + 6, y + 19);

      var filename = "blindspot-analysis-" + new Date().toISOString().slice(0, 10) + ".pdf";
      doc.save(filename);

      setDone(true);
      setTimeout(function() { setDone(false); }, 2500);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
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
          Downloaded!
        </>
      ) : downloading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download PDF
        </>
      )}
    </Button>
  );
};

export default DownloadPDF;
