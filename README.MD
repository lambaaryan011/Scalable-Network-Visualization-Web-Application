# Scalable Network Visualization Web Application

## Overview
This web application allows users to upload network files, validate and visualize them interactively using **Flask** (backend) and **Cytoscape.js** (frontend). It supports multiple network layouts, querying for subgraphs, and interactive exploration.

## Features

### 🔹 File Handling
- Supports multiple network file formats.
- Implements robust error handling for invalid file formats and content.
- Captures and displays Cytoscape.js errors in a user-friendly manner.
- (Optional) Implements streaming or chunked parsing for large files.

### 🔹 Query and Subgraph Extraction
- Provides a search interface for querying nodes.
- Extracts queried nodes and their first-degree neighbors to form a subgraph.

### 🔹 Visualization
- Uses **Cytoscape.js** for interactive network visualization.
- Supports multiple layout options: **Grid, Circle, Force-Directed**, etc.
- Allows users to switch between different layouts dynamically.
- Ensures responsive design with zoom and pan functionalities.

## Tech Stack
- **Backend**: Flask (Python)
- **Frontend**: JavaScript, Cytoscape.js, HTML, CSS
- **Visualization**: Cytoscape.js

## Installation & Setup
### Prerequisites
- Python 3.8+
- Node.js (Optional, for frontend dependencies)
- Flask

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/scalable-network-visualization.git
   cd scalable-network-visualization
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run Flask server:
   ```bash
   python app.py
   ```
4. Open `http://127.0.0.1:5000/` in your browser.

## Usage Guide
1. **Upload a Network File** - Upload supported file formats via the UI.
2. **View & Interact with Graph** - The visualization panel renders the network.
3. **Query Nodes** - Use the search bar to find nodes and extract subgraphs.
4. **Switch Layouts** - Toggle between different network layouts for better visualization.

## Future Enhancements
- Implement **WebSocket support** for real-time updates.
- Add **support for additional file formats**.
- Improve performance for large-scale networks using **streaming or chunked parsing**.

## Contribution
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the MIT License.

---
🚀 Happy Coding! 🎯

