
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const entryList = document.getElementById("entryList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const netBalanceEl = document.getElementById("netBalance");
const filters = document.getElementsByName("filter");

let entries = JSON.parse(localStorage.getItem("entries")) || [];

function saveData() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function updateSummary() {
  const income = entries
    .filter(e => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries
    .filter(e => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  totalIncomeEl.textContent = `₹${income}`;
  totalExpenseEl.textContent = `₹${expense}`;
  netBalanceEl.textContent = `₹${income - expense}`;
}

function displayEntries(filter = "all") {
  entryList.innerHTML = "";
  const filtered = filter === "all" ? entries : entries.filter(e => e.type === filter);

  filtered.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-gray-50 p-2 rounded border";
    li.innerHTML = `
      <span>${entry.description} - ₹${entry.amount} (${entry.type})</span>
      <div class="flex gap-2">
        <button class="text-blue-600" onclick="editEntry(${index})">Edit</button>
        <button class="text-red-600" onclick="deleteEntry(${index})">Delete</button>
      </div>
    `;
    entryList.appendChild(li);
  });

  updateSummary();
}

addBtn.addEventListener("click", () => {
  const desc = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Please enter valid details!");
    return;
  }

  entries.push({ description: desc, amount, type });
  saveData();
  displayEntries();
  resetForm();
});

function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeSelect.value = entry.type;

  addBtn.textContent = "Save";
  addBtn.onclick = () => {
    entries[index] = {
      description: descriptionInput.value.trim(),
      amount: parseFloat(amountInput.value),
      type: typeSelect.value,
    };
    saveData();
    displayEntries();
    resetForm();
    addBtn.textContent = "Add";
    addBtn.onclick = addNewEntry;
  };
}

function deleteEntry(index) {
  if (confirm("Delete this entry?")) {
    entries.splice(index, 1);
    saveData();
    displayEntries();
  }
}

function resetForm() {
  descriptionInput.value = "";
  amountInput.value = "";
  typeSelect.value = "income";
}
resetBtn.addEventListener("click", resetForm);

filters.forEach(f =>
  f.addEventListener("change", e => displayEntries(e.target.value))
);

displayEntries();
