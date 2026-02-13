// Data Storage
let options = [];
let criteria = [];

// Add Option
function addOption() {
    const input = document.getElementById("optionInput");
    const name = input.value.trim();

    if (!name) {
        alert("Please enter an option name!");
        return;
    }

    options.push({ name: name, scores: {} });
    input.value = "";

    renderOptions();
    renderScoreInputs();
}

function renderOptions() {
    const list = document.getElementById("optionList");
    list.innerHTML = "";

    options.forEach((opt, idx) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-lg";
        li.innerHTML = `
            ${opt.name} 
            <button onclick="deleteOption(${idx})" 
                    class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                Delete
            </button>
        `;
        list.appendChild(li);
    });
}

function deleteOption(index) {
    options.splice(index, 1);
    renderOptions();
    renderScoreInputs();
}

// Add Criteria
function addCriteria() {
    const name = document.getElementById("criteriaName").value.trim();
    const weight = parseFloat(document.getElementById("criteriaWeight").value);
    const type = document.getElementById("criteriaType").value;

    if (!name || isNaN(weight)) {
        alert("Please enter valid criteria!");
        return;
    }

    criteria.push({ name, weight, type });
    document.getElementById("criteriaName").value = "";
    document.getElementById("criteriaWeight").value = "";

    renderCriteria();
    renderScoreInputs();
}

function renderCriteria() {
    const list = document.getElementById("criteriaList");
    list.innerHTML = "";

    criteria.forEach((c, idx) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-lg";
        li.innerHTML = `
            ${c.name} - Weight: ${c.weight} - Type: ${c.type} 
            <button onclick="deleteCriteria(${idx})" 
                    class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                Delete
            </button>
        `;
        list.appendChild(li);
    });
}

function deleteCriteria(index) {
    criteria.splice(index, 1);
    renderCriteria();
    renderScoreInputs();
}

// =============================
// Render Score Inputs
// =============================
function renderScoreInputs() {
    const container = document.getElementById("scoreContainer");
    container.innerHTML = "";

    if (options.length === 0 || criteria.length === 0) return;

    options.forEach((opt, i) => {
        const div = document.createElement("div");
        div.className = "mb-6 p-6 bg-white rounded-2xl shadow-md";
        div.innerHTML = `<h3 class="text-xl font-semibold mb-4 text-indigo-600">${opt.name}</h3>`;

        criteria.forEach(c => {
            div.innerHTML += `
                <div class="flex items-center gap-4 mb-3">
                    <label class="w-40 text-lg font-medium text-gray-700">${c.name}:</label>
                    <input type="number" min="0" step="0.01" placeholder="Enter score"
                        class="border-2 border-gray-300 p-2 rounded-xl w-32 text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        onchange="updateScore(${i}, '${c.name}', this.value)">
                </div>
            `;
        });

        container.appendChild(div);
    });
}

function updateScore(optionIndex, criteriaName, value) {
    options[optionIndex].scores[criteriaName] = parseFloat(value);
}

// Calculate Results
function calculateResults() {
    if (options.length === 0 || criteria.length === 0) {
        alert("Add options and criteria first!");
        return;
    }

    // Normalize scores per criteria
    const normalized = criteria.map(c => {
        const scores = options.map(o => o.scores[c.name] || 0);
        const max = Math.max(...scores);
        const min = Math.min(...scores);

        return {
            name: c.name,
            weight: c.weight,
            type: c.type,
            normalizedScores: scores.map(s => {
                if (c.type === "benefit") return max ? s / max : 0;
                else return s ? min / s : 0;
            })
        };
    });

    // Calculate total scores
    const totals = options.map((opt, i) => {
        let total = 0;
        normalized.forEach(c => {
            total += c.normalizedScores[i] * c.weight;
        });
        return { name: opt.name, total };
    });

    // Determine winner
    totals.sort((a, b) => b.total - a.total);
    const winner = totals[0];
    const runnerUp = totals[1] || { total: winner.total };
    const diffPercent = ((winner.total - runnerUp.total) / (runnerUp.total || 1) * 100).toFixed(2);

    // Display result
    const output = document.getElementById("resultOutput");
    output.innerHTML = `
        <div class="bg-indigo-50 p-6 rounded-2xl shadow-md text-center">
            <h3 class="text-2xl font-bold text-indigo-700 mb-2">🏆 Winner: ${winner.name}</h3>
            <p class="text-lg">Total Score: <span class="font-semibold">${winner.total.toFixed(2)}</span></p>
            <p class="text-md text-gray-600 mt-2">
                Difference with next option: ${diffPercent}%
            </p>
        </div>
    `;

    // Show chart
    renderChart(totals);
}

// Render Chart
let chartInstance = null;
function renderChart(data) {
    const ctx = document.getElementById("resultChart").getContext("2d");
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: 'Total Score',
                data: data.map(d => d.total.toFixed(2)),
                backgroundColor: 'rgba(59, 130, 246, 0.7)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Comparison Result', font: { size: 18 } }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}