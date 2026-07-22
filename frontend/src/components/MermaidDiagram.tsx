import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { v4 as uuidv4 } from 'uuid';
import { RefreshCw } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  onRetry?: () => void;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, onRetry }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'strict',
      themeVariables: {
        primaryColor: '#111018',
        primaryTextColor: '#F5F3FA',
        primaryBorderColor: '#1f1d29',
        lineColor: '#14b8a6',
        secondaryColor: '#07070a',
        tertiaryColor: '#181825',
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
        tertiaryTextColor: '#F5F3FA',
        secondaryTextColor: '#F5F3FA'
      }
    });

    const renderChart = async () => {
      try {
        setError(null);
        // Clean up the chart string just in case it has surrounding markdown
        let cleanChart = chart.trim();
        if (cleanChart.startsWith('```mermaid')) {
          cleanChart = cleanChart.replace(/^```mermaid\n?/, '').replace(/\n?```$/, '');
        }
        // Fix any literal \n that might have been double-escaped during DB storage/fetching
        cleanChart = cleanChart.replace(/\\n/g, '\n');

        const id = `mermaid-${uuidv4()}`;
        const { svg } = await mermaid.render(id, cleanChart);
        setSvgContent(svg);
      } catch (err: any) {
        console.error("Mermaid parsing error:", err);
        setError("Failed to render diagram. The AI may have generated invalid Mermaid syntax.");
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg flex flex-col items-start gap-3 text-sm text-red-200">
        <div>{error}</div>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="flex items-center text-xs px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-white rounded transition-colors"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Regenerate Section
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full overflow-x-auto flex justify-center py-4"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
