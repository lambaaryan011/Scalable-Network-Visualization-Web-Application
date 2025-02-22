export interface NetworkData {
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  id: string;
  label?: string;
  [key: string]: any;
}

export interface Edge {
  source: string;
  target: string;
  [key: string]: any;
}

export type LayoutName = 'circle' | 'grid' | 'random' | 'concentric' | 'breadthfirst' | 'cose';