// Replace this with your Render backend URL
const backendURL = "https://swarm-economy-backend.onrender.com"; // <-- ENTER YOUR RENDER BACKEND URL HERE

// Fetch simulation data and update the UI
async function fetchSimulationData() {
    try {
        const response = await fetch(`${backendURL}/simulation-data`);
        if (!response.ok) {
            throw new Error("Failed to fetch simulation data.");
        }
        const data = await response.json();

        // Update total resources and token value
        document.getElementById("total-resources").innerText = data.total_resources.toLocaleString();
        document.getElementById("token-value").innerText = data.token_value.toFixed(7);

        // Update agents list
        updateAgentsList(data.agents);

        // Update heatmap
        updateHeatmap(data.agents);

    } catch (error) {
        console.error("Error fetching simulation data:", error);
    }
}

// Simulate the next step
async function simulateNextStep() {
    try {
        const response = await fetch(`${backendURL}/simulate`, { method: "POST" });
        if (!response.ok) {
            throw new Error("Failed to simulate next step.");
        }
        console.log("Simulation step completed.");
        fetchSimulationData(); // Refresh the data
    } catch (error) {
        console.error("Error simulating next step:", error);
    }
}

// Update agents list
function updateAgentsList(agents) {
    const agentsContainer = document.getElementById("agents-container");
    agentsContainer.innerHTML = ""; // Clear previous data

    agents.forEach(agent => {
        const agentElement = document.createElement("div");
        agentElement.classList.add("agent");
        agentElement.innerHTML = `
            <strong>ID:</strong> ${agent.id} |
            <strong>Role:</strong> ${agent.role} |
            <strong>Tokens:</strong> ${agent.tokens.toLocaleString()} |
            <strong>Position:</strong> (${agent.position.x}, ${agent.position.y})
        `;
        agentsContainer.appendChild(agentElement);
    });
}

// Update agent heatmap
function updateHeatmap(agents) {
    const canvas = document.getElementById("heatmap");
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw agents as circles
    agents.forEach(agent => {
        ctx.beginPath();
        ctx.arc(agent.position.x, agent.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = agent.role === "Producer" ? "green" : "red";
        ctx.fill();
    });
}

// Initialize the page
document.getElementById("simulate-button").addEventListener("click", simulateNextStep);

// Fetch initial data when the page loads
fetchSimulationData();
