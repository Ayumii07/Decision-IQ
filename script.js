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
        li.className = "flex justify-between bg-gray-100 p-2 rounded";
        li.innerHTML = `
            ${opt.name} 
            <button onclick="deleteOption(${idx})" class="text-red-600 hover:underline">Delete</button>
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
        li.className = "flex justify-between bg-gray-100 p-2 rounded";
        li.innerHTML = `
            ${c.name} - Weight: ${c.weight} - Type: ${c.type} 
            <button onclick="deleteCriteria(${idx})" class="text-red-600 hover:underline">Delete</button>
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
        div.className = "mb-4 p-2 bg-gray-50 rounded";
        div.innerHTML = `<h3 class="font-semibold mb-2">${opt.name}</h3>`;

        criteria.forEach(c => {
            div.innerHTML += `
                <div class="flex items-center gap-2 mb-1">
                    <label class="w-40">${c.name}:</label>
                    <input type="number" min="0" step="0.01" placeholder="Enter score"
                        class="border p-1 rounded w-32"
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
        Winner: <span class="font-bold">${winner.name}</span><br>
        Total Score: <span class="font-bold">${winner.total.toFixed(2)}</span><br>
        Difference with next option: ${diffPercent}%
    `;

    // Show chart
    renderChart(totals);
}

