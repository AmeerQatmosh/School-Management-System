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
