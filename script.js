const name = document.getElementById("name");
const studentid = document.getElementById("studentid");
const email = document.getElementById("email");
const contact = document.getElementById("contact");
const table = document.getElementById("Records-Table");
const tbody = document.getElementsByTagName("tbody")[0];
const form = document.getElementById("record-form");
const submitbtn = document.getElementById("submit-btn");

submitbtn.addEventListener("click", addOrUpdateRecord);

document.addEventListener("DOMContentLoaded", loadRecords);

let editMode = false;
let editId = null;

function addOrUpdateRecord(event) {
    event.preventDefault();

    if (name.value === "" || studentid.value === "" || email.value === "" || contact.value === "") {
        alert("Please fill out each field!");
        return;
    }

    if (!validateEmail(email.value)) {
        alert("Please enter a valid email address!");
        return;
    }

    const record = {
        id: editMode ? editId : Date.now(),
        name: name.value,
        studentid: studentid.value,
        email: email.value,
        contact: contact.value
    };

    if (editMode) {
        updateRecordInTable(record);
        updateRecordInStorage(record);
        editMode = false;
        editId = null;
    } else {
        appendRecordToTable(record);
        saveRecord(record);
    }

    form.reset();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function appendRecordToTable(record) {
    const temp_row = document.createElement("tr");
    temp_row.setAttribute("data-id", record.id);

    const temp_name = document.createElement("td");
    temp_name.innerHTML = record.name;

    const temp_studentid = document.createElement("td");
    temp_studentid.innerHTML = record.studentid;

    const temp_email = document.createElement("td");
    temp_email.innerHTML = record.email;

    const temp_contact = document.createElement("td");
    temp_contact.innerHTML = record.contact;

    const edit_btn = document.createElement("td");
    edit_btn.innerHTML = `<button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>`;

    const del_btn = document.createElement("td");
    del_btn.innerHTML = `<button class="del-btn"><i class="fa-solid fa-trash"></i></button>`;

    temp_row.appendChild(temp_name);
    temp_row.appendChild(temp_studentid);
    temp_row.appendChild(temp_email);
    temp_row.appendChild(temp_contact);
    temp_row.appendChild(edit_btn);
    temp_row.appendChild(del_btn);

    tbody.appendChild(temp_row);

    del_btn.querySelector('.del-btn').addEventListener('click', deleteRecord);
    edit_btn.querySelector('.edit-btn').addEventListener('click', editRecord);
}

function updateRecordInTable(record) {
    const row = tbody.querySelector(`tr[data-id='${record.id}']`);
    row.children[0].textContent = record.name;
    row.children[1].textContent = record.studentid;
    row.children[2].textContent = record.email;
    row.children[3].textContent = record.contact;
}

function editRecord(event) {
    const row = event.target.closest('tr');
    const recordId = row.getAttribute('data-id');
    const records = JSON.parse(localStorage.getItem('records')) || [];
    const record = records.find(record => record.id == recordId);

    name.value = record.name;
    studentid.value = record.studentid;
    email.value = record.email;
    contact.value = record.contact;

    editMode = true;
    editId = recordId;
}

function deleteRecord(event) {
    const row = event.target.closest('tr');
    const recordId = row.getAttribute('data-id');

    row.remove();
    removeRecordFromStorage(recordId);
}

function removeRecordFromStorage(id) {
    let records = JSON.parse(localStorage.getItem('records')) || [];
    records = records.filter(record => record.id != id);
    localStorage.setItem('records', JSON.stringify(records));
}

function updateRecordInStorage(updatedRecord) {
    let records = JSON.parse(localStorage.getItem('records')) || [];
    records = records.map(record => record.id === updatedRecord.id ? updatedRecord : record);
    localStorage.setItem('records', JSON.stringify(records));
}

function saveRecord(record) {
    let records = JSON.parse(localStorage.getItem('records')) || [];
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
}

function loadRecords() {
    let records = JSON.parse(localStorage.getItem('records')) || [];
    records.forEach(record => appendRecordToTable(record));
}
