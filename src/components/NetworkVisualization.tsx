import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { NetworkData, LayoutName } from '../types';
import { Search, RotateCcw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface NetworkVisualizationProps {
  data: NetworkData;
}

const LAYOUT_OPTIONS: Record<LayoutName, cytoscape.LayoutOptions> = {
  circle: { 
    name: 'circle',
    padding: 50,
    animate: true,
    animationDuration: 1000
  },
  grid: { 
    name: 'grid',
    padding: 50,
    animate: true,
    animationDuration: 1000
  },
  random: { 
    name: 'random',
    padding: 50,
    animate: true,
    animationDuration: 1000
  },
  concentric: { 
    name: 'concentric',
    padding: 50,
    animate: true,
    animationDuration: 1000,
    minNodeSpacing: 50
  },
  breadthfirst: { 
    name: 'breadthfirst',
    padding: 50,
    animate: true,
    animationDuration: 1000
  },
  cose: {
    name: 'cose',
    padding: 50,
    nodeRepulsion: 8000,
    idealEdgeLength: 100,
    animate: true,
    animationDuration: 1000,
    randomize: true,
    componentSpacing: 100,
    nodeOverlap: 20,
    gravity: 1
  }
};

export function NetworkVisualization({ data }: NetworkVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [layout, setLayout] = useState<LayoutName>('cose');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: {
        nodes: data.nodes.map(node => ({
          data: { ...node, label: node.label || node.id }
        })),
        edges: data.edges.map(edge => ({
          data: { ...edge, id: `${edge.source}-${edge.target}` }
        }))
      },
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'var(--node-color)',
            'label': 'data(label)',
            'color': 'var(--text-primary)',
            'font-size': '12px',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': 40,
            'height': 40,
            'border-width': 2,
            'border-color': 'rgba(255, 255, 255, 0.2)',
            'transition-property': 'background-color, border-color, border-width',
            'transition-duration': '0.2s'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': 'var(--edge-color)',
            'target-arrow-color': 'var(--edge-color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.6
          }
        },
        {
          selector: 'node.highlighted',
          style: {
            'background-color': '#48bb78',
            'border-width': 3,
            'border-color': '#2f855a'
          }
        },
        {
          selector: 'node.neighbor',
          style: {
            'background-color': '#ed8936',
            'border-width': 3,
            'border-color': '#dd6b20'
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#48bb78',
            'target-arrow-color': '#48bb78',
            'width': 2,
            'opacity': 1
          }
        }
      ],
      layout: LAYOUT_OPTIONS[layout],
      wheelSensitivity: 0.2,
      minZoom: 0.1,
      maxZoom: 3
    });

    setStats({
      nodes: data.nodes.length,
      edges: data.edges.length
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [data]);

  useEffect(() => {
    cyRef.current?.layout(LAYOUT_OPTIONS[layout]).run();
  }, [layout]);

  const handleSearch = () => {
    if (!cyRef.current || !searchQuery) return;

    const cy = cyRef.current;
    cy.elements().removeClass('highlighted neighbor');

    const matchedNodes = cy.nodes().filter(node => 
      node.data('label').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedNodes.length === 0) return;

    const newSelectedNodes = matchedNodes.map(node => node.id());
    setSelectedNodes(newSelectedNodes);

    matchedNodes.addClass('highlighted');
    matchedNodes.neighborhood('node').addClass('neighbor');
    matchedNodes.connectedEdges().addClass('highlighted');
  };

  const resetVisualization = () => {
    if (!cyRef.current) return;
    
    cyRef.current.elements().removeClass('highlighted neighbor');
    setSelectedNodes([]);
    setSearchQuery('');
    cyRef.current.fit();
  };

  const handleZoom = (factor: number) => {
    cyRef.current?.zoom({
      level: cyRef.current.zoom() * factor,
      renderedPosition: {
        x: containerRef.current?.clientWidth! / 2,
        y: containerRef.current?.clientHeight! / 2
      }
    });
  };

  const handleFit = () => {
    cyRef.current?.fit();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 p-4 border-b border-white/10">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Layout
          </label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value as LayoutName)}
            className="block w-full rounded-md border border-white/10 bg-white/5 text-[var(--text-primary)] shadow-sm focus:border-[var(--accent-blue)] focus:ring-[var(--accent-blue)]"
          >
            <option value="cose">Force-directed (CoSE)</option>
            <option value="circle">Circle</option>
            <option value="grid">Grid</option>
            <option value="random">Random</option>
            <option value="concentric">Concentric</option>
            <option value="breadthfirst">Breadth-first</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Search Nodes
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter node label..."
              className="block w-full rounded-md border border-white/10 bg-white/5 text-[var(--text-primary)] shadow-sm focus:border-[var(--accent-blue)] focus:ring-[var(--accent-blue)]"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[var(--accent-blue)] text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={() => handleZoom(1.2)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleFit}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Fit to View"
          >
            <Maximize className="w-5 h-5" />
          </button>
          <button
            onClick={resetVisualization}
            className="px-4 py-2 bg-white/10 text-[var(--text-primary)] rounded-md hover:bg-white/20 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative grid-background" ref={containerRef} />

      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">{stats.nodes}</span> nodes, 
          <span className="font-medium text-[var(--text-primary)] ml-1">{stats.edges}</span> edges
        </div>
        {selectedNodes.length > 0 && (
          <div className="flex gap-2">
            {selectedNodes.map(nodeId => (
              <span
                key={nodeId}
                className="px-2 py-1 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] rounded-md text-sm"
              >
                {nodeId}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}