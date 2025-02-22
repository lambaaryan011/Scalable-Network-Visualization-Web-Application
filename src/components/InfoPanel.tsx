import React from 'react';
import { X } from 'lucide-react';

interface InfoPanelProps {
  onClose: () => void;
}

export function InfoPanel({ onClose }: InfoPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            About Network Visualizer
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="prose prose-blue max-w-none">
          <p>
            Network Visualizer is an interactive tool for analyzing and visualizing network data.
            Upload your network data in JSON format and explore the relationships between nodes
            using various layout algorithms and search capabilities.
          </p>
          
          <h3>Features</h3>
          <ul>
            <li>Support for large network files with automatic validation</li>
            <li>Interactive visualization with zoom and pan</li>
            <li>Multiple layout options (Force-directed, Circle, Grid, etc.)</li>
            <li>Search and highlight nodes with their neighbors</li>
            <li>Real-time network manipulation and exploration</li>
          </ul>
          
          <h3>Getting Started</h3>
          <ol>
            <li>Prepare your network data in JSON format</li>
            <li>Upload the file using the drag-and-drop interface</li>
            <li>Use the search bar to find specific nodes</li>
            <li>Experiment with different layouts to find the best visualization</li>
          </ol>
        </div>
      </div>
    </div>
  );
}