import React, { useState } from 'react';
import { NetworkData } from './types';
import { FileUpload } from './components/FileUpload';
import { NetworkVisualization } from './components/NetworkVisualization';
import { Network, Info } from 'lucide-react';

function App() {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleFileUpload = (data: NetworkData) => {
    setNetworkData(data);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setNetworkData(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] grid-background">
      <header className="glass-panel mx-4 mt-4 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="w-8 h-8 text-[var(--accent-blue)]" />
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Scalable Network Visualization
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Interactive Network Analysis Tool
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Show Information"
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 flex flex-col gap-4">
        {!networkData ? (
          <div className="glass-panel p-6">
            <div className="max-w-xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
                Upload Network Data
              </h2>
              <FileUpload onFileUpload={handleFileUpload} onError={handleError} />
              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-md">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel h-[800px] overflow-hidden">
            <NetworkVisualization data={networkData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App