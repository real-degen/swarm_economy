// script.js

// Fetch simulation data from the backend API
async function fetchSimulationData() {
    try {
        const response = await fetch('http://172.31.196.55:5000/api/data'); // Update with correct backend URL
        const data = await response.json();

        // Update total resources and token value
        document.getElementById('total-resources').innerText = data.total_resources.toLocaleString();
        document.getElementById('token-value').innerText = data.token_value.toFixed(10);

        // Update agent list
        const agentListContainer = document.getElementById('agent-list');
        agentListContainer.innerHTML = '';
        data.agents.forEach(agent => {
            const agentDiv = document.createElement('div');
            agentDiv.classList.add('agent');
            agentDiv.innerHTML = `
                <strong>${agent.role}</strong>
                <p>Resources: ${agent.resources}</p>
                <p>Tokens: ${agent.tokens}</p>
                <p>Location: (${agent.x}, ${agent.y})</p>
            `;
            agentListContainer.appendChild(agentDiv);
        });

        // Update the heatmap
        updateHeatmap(data.agents);
    } catch (error) {
        console.error('Error fetching simulation data:', error);
    }
}

// Update the heatmap grid based on agent positions
function updateHeatmap(agents) {
    const heatmapGrid = document.getElementById('heatmap-grid');
    heatmapGrid.innerHTML = '';

    // Create a 10x10 grid of cells
    const grid = Array.from({ length: 100 }, () => document.createElement('div'));
    grid.forEach(cell => cell.classList.add('grid-cell'));

    // Add agents' positions to the grid
    agents.forEach(agent => {
        const cellIndex = agent.y * 10 + agent.x; // Calculate grid position
        grid[cellIndex].classList.add('agent');
    });

    grid.forEach(cell => heatmapGrid.appendChild(cell));
}

// Simulate a step and update the UI
async function simulateStep() {
    try {
        const response = await fetch('http://172.31.196.55:5000/api/simulate', { method: 'POST' });
        const result = await response.json();
        console.log(result.message);
        fetchSimulationData(); // Fetch and update the data after simulation
    } catch (error) {
        console.error('Error simulating step:', error);
    }
}

// Set up the event listener for the "Simulate Next Step" button
document.getElementById('simulate-btn').addEventListener('click', simulateStep);

// Fetch initial simulation data on page load
fetchSimulationData();
