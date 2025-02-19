var students = [];
var selectedRow = null;
var rowToDelete = null;

function onFormSubmit() {
    if (validate()) {
        var studentData = readFormData();
        if (selectedRow == null)
            insertNewRecord(studentData);
        else
            updateRecord(studentData);
        resetForm();
    }
}

function readFormData() {
    var student = {};
    student["name"] = document.getElementById("name").value;
    student["idNumber"] = document.getElementById("idNumber").value;
    student["gpa"] = document.getElementById("gpa").value;
    return student;
}

function insertNewRecord(data) {
    var table = document.getElementById("studentList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    var cell1 = newRow.insertCell(0);
    cell1.textContent = data.name;
    var cell2 = newRow.insertCell(1);
    cell2.textContent = data.idNumber;
    var cell3 = newRow.insertCell(2);
    cell3.textContent = data.gpa;
    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>`;
    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<a onClick="onDelete(this)" style="color: red;">Delete</a>`;
}

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("idNumber").value = "";
    document.getElementById("gpa").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[0].textContent;
    document.getElementById("idNumber").value = selectedRow.cells[1].textContent;
    document.getElementById("gpa").value = selectedRow.cells[2].textContent;
}

function updateRecord(student) {
    selectedRow.cells[0].textContent = student.name;
    selectedRow.cells[1].textContent = student.idNumber;
    selectedRow.cells[2].textContent = student.gpa;
}

function onDelete(td) {
    rowToDelete = td.parentElement.parentElement;
    document.getElementById("deleteModal").style.display = "block";
}

function confirmDelete() {
    document.getElementById("studentList").deleteRow(rowToDelete.rowIndex);
    resetForm();
    closeModal();
}

function closeModal() {
    document.getElementById("deleteModal").style.display = "none";
}

function validate() {
    var isValid = true;
    if (document.getElementById("name").value == "") {
        isValid = false;
        document.getElementById("nameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("nameValidationError").classList.contains("hide"))
            document.getElementById("nameValidationError").classList.add("hide");
    }
    return isValid;
}

// Event listeners for modal buttons
document.getElementById("confirmDelete").addEventListener("click", confirmDelete);
document.getElementById("cancelDelete").addEventListener("click", closeModal);
document.querySelector(".close").addEventListener("click", closeModal);
window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("deleteModal")) {
        closeModal();
    }
});