var students = JSON.parse(localStorage.getItem("students")) || [];
var selectedRow = null;
var rowToDelete = null;

document.addEventListener("DOMContentLoaded", function () {
    loadTable();
    restoreFormInputs();
});

function onFormSubmit() {
    if (validate()) {
        var studentData = readFormData();
        if (selectedRow == null) {
            insertNewRecord(studentData);
            students.push(studentData);
        } else {
            updateRecord(studentData);
        }
        saveToLocalStorage();
        resetForm();
    }
}

function readFormData() {
    return {
        name: document.getElementById("name").value,
        idNumber: document.getElementById("idNumber").value,
        gpa: document.getElementById("gpa").value
    };
}

function insertNewRecord(data) {
    var table = document.getElementById("studentList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    newRow.insertCell(0).textContent = data.name;
    newRow.insertCell(1).textContent = data.idNumber;
    newRow.insertCell(2).textContent = data.gpa;
    newRow.insertCell(3).innerHTML = `<a onClick="onEdit(this)">Edit</a>`;
    newRow.insertCell(4).innerHTML = `<a onClick="onDelete(this)" style="color: red;">Delete</a>`;

    // Store in LocalStorage
    saveData();
}

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("idNumber").value = "";
    document.getElementById("gpa").value = "";
    localStorage.removeItem("formInputs");
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[0].textContent;
    document.getElementById("idNumber").value = selectedRow.cells[1].textContent;
    document.getElementById("gpa").value = selectedRow.cells[2].textContent;

    students.splice(selectedRow.rowIndex - 1, 1);
    saveToLocalStorage();
}

function updateRecord(student) {
    selectedRow.cells[0].textContent = student.name;
    selectedRow.cells[1].textContent = student.idNumber;
    selectedRow.cells[2].textContent = student.gpa;
    students[selectedRow.rowIndex - 1] = student;
    saveToLocalStorage();
}

function onDelete(td) {
    rowToDelete = td.parentElement.parentElement;

        const modalText = document.querySelector("#deleteModal p");
    modalText.textContent = "Are you sure you want to delete this record?"; // Keep original text
    
    document.getElementById("confirmDelete").onclick = confirmDelete;
    document.getElementById("deleteModal").style.display = "block";
}

function confirmDelete() {
    students.splice(rowToDelete.rowIndex - 1, 1);
    document.getElementById("studentList").deleteRow(rowToDelete.rowIndex);
    saveToLocalStorage();
    resetForm();
    closeModal();
}

function closeModal() {
    document.getElementById("deleteModal").style.display = "none";
}

function validate() {
    var isValid = true;
    var nameField = document.getElementById("name");
    var errorLabel = document.getElementById("nameValidationError");

    if (nameField.value.trim() === "") {
        isValid = false;
        errorLabel.classList.remove("hide");
    } else {
        errorLabel.classList.add("hide");
    }
    return isValid;
}

// Save students to localStorage
function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Load students from localStorage
function loadTable() {
    var table = document.getElementById("studentList").getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    students.forEach(insertNewRecord);
}

// Store form inputs while typing
["name", "idNumber", "gpa"].forEach(id => {
    document.getElementById(id).addEventListener("input", saveFormInputs);
});

function saveFormInputs() {
    var inputs = {
        name: document.getElementById("name").value,
        idNumber: document.getElementById("idNumber").value,
        gpa: document.getElementById("gpa").value
    };
    localStorage.setItem("formInputs", JSON.stringify(inputs));
}

// Restore form inputs after refresh
function restoreFormInputs() {
    var savedInputs = JSON.parse(localStorage.getItem("formInputs"));
    if (savedInputs) {
        document.getElementById("name").value = savedInputs.name || "";
        document.getElementById("idNumber").value = savedInputs.idNumber || "";
        document.getElementById("gpa").value = savedInputs.gpa || "";
    }
}

// Modal event listeners
document.getElementById("confirmDelete").addEventListener("click", confirmDelete);
document.getElementById("cancelDelete").addEventListener("click", closeModal);
document.querySelector(".close").addEventListener("click", closeModal);
window.addEventListener("click", event => {
    if (event.target == document.getElementById("deleteModal")) closeModal();
});

function showClearConfirmation() {
    const modalText = document.querySelector("#deleteModal p"); // Selects the <p> inside modal
    modalText.textContent = "Are you sure you want to delete all records?";

    document.getElementById("confirmDelete").onclick = clearAllData;
    document.getElementById("deleteModal").style.display = "block";
}


function clearAllData() {
    students = [];
    saveToLocalStorage();
    loadTable();
    closeModal();
}



// ************************************************ Import/Export ************************************************************** //

// Export to JSON
function exportToJSON() {
    const jsonData = JSON.stringify(students, null, 2);
    downloadFile(jsonData, "students.json", "application/json");
}

// Export to CSV
function exportToCSV() {
    let csv = "Student Name,Student ID,Student GPA\n";
    students.forEach(student => {
        csv += `${student.name},${student.idNumber},${student.gpa}\n`;
    });
    downloadFile(csv, "students.csv", "text/csv");
}

// Download file
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import JSON/CSV file
function importFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        if (file.name.endsWith(".json")) {
            importFromJSON(content);
        } else if (file.name.endsWith(".csv")) {
            importFromCSV(content);
        }
    };
    reader.readAsText(file);
}

// Import JSON
function importFromJSON(jsonContent) {
    try {
        const importedData = JSON.parse(jsonContent);
        students = [...students, ...importedData]; // Merge new data
        saveToLocalStorage();
        location.reload(); // Reload page to update table
    } catch (error) {
        alert("Invalid JSON file format.");
    }
}

// Import CSV
function importFromCSV(csvContent) {
    const lines = csvContent.split("\n").slice(1); // Skip header row
    const newStudents = [];

    lines.forEach(line => {
        const [name, idNumber, gpa] = line.split(",");
        if (name && idNumber && gpa) {
            const student = { name: name.trim(), idNumber: idNumber.trim(), gpa: gpa.trim() };
            newStudents.push(student);
        }
    });

    // Merge the new data with the existing data
    students = [...students, ...newStudents];
    saveToLocalStorage();
    loadTable(); // Refresh the table without reloading the page
}







//**************************************************************************************************** */ //




function loadData() {
    var storedData = localStorage.getItem("students");
    if (storedData) {
        students = JSON.parse(storedData);
        
        // Clear existing table rows before inserting data
        var table = document.getElementById("studentList").getElementsByTagName("tbody")[0];
        table.innerHTML = "";

        students.forEach(insertNewRecord);
    }
}

window.onload = loadData;


function saveData() {
    var table = document.getElementById("studentList").getElementsByTagName("tbody")[0];
    var rows = table.getElementsByTagName("tr");
    students = [];
    
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        var student = {
            name: cells[0].textContent,
            idNumber: cells[1].textContent,
            gpa: cells[2].textContent
        };
        students.push(student);
    }

    localStorage.setItem("students", JSON.stringify(students));
}