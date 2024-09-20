let loggedIn = false;
let userRole = '';
const appraisals = [];

document.getElementById('loginLink').onclick = function() {
    toggleVisibility('loginForm');
};

document.getElementById('selfAppraisalLink').onclick = function() {
    toggleVisibility('selfAppraisalForm');
};

document.getElementById('adminLink').onclick = function() {
    toggleVisibility('adminPanel');
    loadAppraisals();
};

document.getElementById('logoutLink').onclick = function() {
    loggedIn = false;
    userRole = '';
    toggleVisibility('loginForm');
    document.getElementById('selfAppraisalLink').style.display = 'none';
    document.getElementById('adminLink').style.display = 'none';
    document.getElementById('logoutLink').style.display = 'none';
    alert('Logged out successfully!');
};

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Simple authentication simulation
    if ((role === 'faculty' && username === 'faculty' && password === 'password') ||
        (role === 'admin' && username === 'admin' && password === 'admin')) {
        loggedIn = true;
        userRole = role;
        toggleVisibility(role === 'faculty' ? 'selfAppraisalForm' : 'adminPanel');
        document.getElementById('selfAppraisalLink').style.display = role === 'faculty' ? 'inline' : 'none';
        document.getElementById('adminLink').style.display = role === 'admin' ? 'inline' : 'none';
        document.getElementById('logoutLink').style.display = 'inline';
        alert(`Logged in as ${role}`);
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function handleSelfAppraisal(event) {
    event.preventDefault();
    const name = document.getElementById('facultyName').value;
    const employeeCode = document.getElementById('employeeCode').value;
    const publications = document.getElementById('publications').value;
    const events = document.getElementById('events').value;
    const lectures = document.getElementById('lectures').value;
    const date = new Date().toLocaleDateString();
    const row = { name, employeeCode, publications, events, lectures, date };
    appraisals.push(row);
    addRowToTable(row);
    alert('Appraisal submitted successfully!');
    document.getElementById('selfAppraisalForm').reset();
}

function loadAppraisals() {
    const tbody = document.querySelector('#appraisalTable tbody');
    tbody.innerHTML = ''; // Clear previous entries
    const criteria = document.getElementById('sortCriteria').value;

    let sortedAppraisals = [...appraisals];
    if (criteria === 'name') {
        sortedAppraisals.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'code') {
        sortedAppraisals.sort((a, b) => a.employeeCode.localeCompare(b.employeeCode));
    } else if (criteria === 'date') {
        sortedAppraisals.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    sortedAppraisals.forEach(addRowToTable);
}

function addRowToTable(row) {
    const tbody = document.querySelector('#appraisalTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.name}</td>
                    <td>${row.employeeCode}</td>
                    <td>${row.publications}</td>
                    <td>${row.events}</td>
                    <td>${row.lectures}</td>
                    <td>${row.date}</td>
                    <td><button onclick="deleteEntry('${row.name}')">Delete</button></td>`;
    tbody.appendChild(tr);
}

// function deleteEntry(name) {
//     const index = appraisals.findIndex(entry => entry.name === name);
//     if (index > -1) {
//         appraisals.splice(index, 1);
//         loadAppraisals();
//         alert(`Entry for ${name} deleted successfully!`);
//     }
// }

function downloadPDF() {
    const doc = new jsPDF();
    const tableData = appraisals.map(row => [row.name, row.employeeCode, row.publications, row.events, row.lectures, row.date]);

    doc.autoTable({
        head: [['Name', 'Employee Code', 'Publications', 'Events', 'Lectures', 'Date']],
        body: tableData,
    });
    
    doc.save('appraisal_data.pdf');
}

function toggleVisibility(formId) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('selfAppraisalForm').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';

    if (formId) {
        document.getElementById(formId).style.display = 'block';
    }
}
