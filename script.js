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



   
