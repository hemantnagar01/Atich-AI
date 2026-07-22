import React, { useState } from 'react';
import { Download, FileText, Link, Check } from 'lucide-react';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ExportBarProps {
  projectName: string;
  sections: Record<string, any>;
  onShare: () => Promise<string | null>;
}

export const ExportBar: React.FC<ExportBarProps> = ({ projectName, sections, onShare }) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sections, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${projectName.replace(/\s+/g, '_').toLowerCase()}_blueprint.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportMarkdown = () => {
    let md = `# ${projectName} - Architecture Blueprint\n\n`;

    if (sections.executiveSummary) {
      md += `## Executive Summary\n`;
      md += `**Headline:** ${sections.executiveSummary.headline}\n\n`;
      md += `**Problem:** ${sections.executiveSummary.problem}\n\n`;
      md += `**Solution:** ${sections.executiveSummary.solution}\n\n`;
      md += `**Unique Value:** ${sections.executiveSummary.uniqueValue}\n\n`;
    }

    if (sections.architecture) {
      md += `## Architecture\n`;
      md += `${sections.architecture.description}\n\n`;
      if (sections.architecture.diagram) {
        md += `\`\`\`mermaid\n${sections.architecture.diagram}\n\`\`\`\n\n`;
      }
      if (sections.architecture.components) {
        md += `**Components:**\n${sections.architecture.components.map((c: string) => `- ${c}`).join('\n')}\n\n`;
      }
    }

    if (sections.database) {
      md += `## Database Schema\n`;
      md += `${sections.database.description}\n\n`;
      if (sections.database.erd) {
        md += `\`\`\`mermaid\n${sections.database.erd}\n\`\`\`\n\n`;
      }
      if (sections.database.tables) {
        md += `**Tables:**\n${sections.database.tables.map((t: string) => `- ${t}`).join('\n')}\n\n`;
      }
    }

    if (sections.techStack && sections.techStack.stack) {
      md += `## Tech Stack\n`;
      sections.techStack.stack.forEach((item: any) => {
        md += `### ${item.layer}: ${item.name}\n`;
        md += `**Reason:** ${item.reason}\n`;
        if (item.alternatives && item.alternatives.length > 0) {
          md += `**Alternatives:** ${item.alternatives.join(', ')}\n`;
        }
        if (item.docsUrl) {
          md += `[Documentation](${item.docsUrl})\n`;
        }
        md += `\n`;
      });
    }

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${projectName.replace(/\s+/g, '_').toLowerCase()}_blueprint.md`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('blueprint-content');
    if (!element) return;
    
    try {
      setIsExportingPDF(true);
      
      // html2canvas needs the full height of the scrollable element to capture everything
      // We temporarily adjust the styling to let it expand fully
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;
      
      // Let it expand to full height for capture
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#0f1117' // Match the app background
      });
      
      // Restore styles
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If the image height is greater than one A4 page, we need to handle pagination
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${projectName.replace(/\s+/g, '_').toLowerCase()}_blueprint.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleCopyLink = async () => {
    setIsSharing(true);
    const url = await onShare();
    setIsSharing(false);
    
    if (url) {
      try {
        // navigator.clipboard only works on localhost or HTTPS.
        // On an AWS HTTP IP, it will fail, so we need a fallback.
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          // Fallback for insecure contexts (HTTP)
          const textArea = document.createElement("textarea");
          textArea.value = url;
          
          // Move outside of screen to make it invisible
          textArea.style.position = "absolute";
          textArea.style.left = "-999999px";
          
          document.body.appendChild(textArea);
          textArea.select();
          
          try {
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Fallback copy failed', err);
            // If all automated copying fails, show it to the user so they can copy it manually
            prompt("Your browser blocked automatic copying. Copy the link below:", url);
          } finally {
            textArea.remove();
          }
        }
      } catch (err) {
        console.error('Failed to copy:', err);
        prompt("Your browser blocked automatic copying. Copy the link below:", url);
      }
    }
  };

  return (
    <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm font-medium text-text-primary">
        Blueprint Generation Complete
      </div>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={handleExportPDF}
          disabled={isExportingPDF}
          className="flex items-center px-4 py-2 bg-surface border border-border hover:border-accent-start hover:text-white transition-colors rounded-lg text-sm disabled:opacity-50"
        >
          <FileText className="w-4 h-4 mr-2" />
          {isExportingPDF ? 'Exporting...' : 'Export PDF'}
        </button>
        <button 
          onClick={handleExportJSON}
          className="flex items-center px-4 py-2 bg-surface border border-border hover:border-accent-start hover:text-white transition-colors rounded-lg text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </button>
        <button 
          onClick={handleExportMarkdown}
          className="flex items-center px-4 py-2 bg-surface border border-border hover:border-accent-start hover:text-white transition-colors rounded-lg text-sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export Markdown
        </button>
        <button 
          onClick={handleCopyLink}
          disabled={isSharing}
          className="flex items-center px-4 py-2 bg-accent-start/10 text-accent-start hover:bg-accent-start hover:text-white border border-accent-start/30 hover:border-accent-start transition-colors rounded-lg text-sm relative disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Link className="w-4 h-4 mr-2" />}
          {copied ? 'Link Copied!' : isSharing ? 'Saving...' : 'Copy Shareable Link'}
        </button>
      </div>
    </div>
  );
};
