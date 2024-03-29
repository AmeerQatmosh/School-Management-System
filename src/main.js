var students = [];
var selectedRow = null;

function onFormSubmit() {
    if (validate()) {
        var students = readFormData();
        if (selectedRow == null)
            insertNewRecord(students);
        else
            updateRecord(students);
        resetForm();
    }
}

function readFormData() {
    var students = {};
    students["name"] = document.getElementById("name").value;
    students["idNumber"] = document.getElementById("idNumber").value;
    students["gpa"] = document.getElementById("gpa").value;
    return students;
}

function insertNewRecord(data) {
    var table = document.getElementById("studentList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.name;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.idNumber;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.gpa;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>`;
	cell5 = newRow.insertCell(4);
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
    document.getElementById("name").value = selectedRow.cells[0].innerHTML;
    document.getElementById("idNumber").value = selectedRow.cells[1].innerHTML;
    document.getElementById("gpa").value = selectedRow.cells[2].innerHTML;
}
function updateRecord(students) {
    selectedRow.cells[0].innerHTML = students.name;
    selectedRow.cells[1].innerHTML = students.idNumber;
    selectedRow.cells[2].innerHTML = students.gpa;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("studentList").deleteRow(row.rowIndex);
        resetForm();
    }
}
function validate() {
    isValid = true;
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