import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (data: any) => void;
  onError: (error: string) => void;
}

export function FileUpload({ onFileUpload, onError }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (!data.nodes || !Array.isArray(data.nodes)) {
          throw new Error('Invalid network format: "nodes" must be an array');
        }

        if (!data.edges || !Array.isArray(data.edges)) {
          throw new Error('Invalid network format: "edges" must be an array');
        }

        const invalidNode = data.nodes.find((node: any) => !node.id);
        if (invalidNode) {
          throw new Error('Invalid network format: All nodes must have an ID');
        }

        const invalidEdge = data.edges.find((edge: any) => !edge.source || !edge.target);
        if (invalidEdge) {
          throw new Error('Invalid network format: All edges must have source and target');
        }

        const nodeIds = new Set(data.nodes.map((node: any) => node.id));
        const invalidReference = data.edges.find((edge: any) => 
          !nodeIds.has(edge.source) || !nodeIds.has(edge.target)
        );
        if (invalidReference) {
          throw new Error('Invalid network format: Edge references non-existent node');
        }

        onFileUpload(data);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to parse network file');
      }
    };

    reader.onerror = () => {
      onError('Error reading file');
    };

    reader.readAsText(file);
  }, [onFileUpload, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10' 
            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
          isDragActive ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]'
        }`} />
        <p className="text-lg text-[var(--text-primary)]">
          {isDragActive ? 'Drop the network file here' : 'Drag & drop a network file, or click to select'}
        </p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Supported format: JSON</p>
      </div>

      <div className="mt-4 p-4 bg-[var(--accent-blue)]/10 rounded-md flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[var(--accent-blue)] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--text-secondary)]">
          <p className="font-medium mb-1 text-[var(--text-primary)]">File Requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Must be a valid JSON file</li>
            <li>Contains "nodes" array with unique IDs</li>
            <li>Contains "edges" array with valid source and target references</li>
            <li>Edge source/target must reference existing node IDs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}