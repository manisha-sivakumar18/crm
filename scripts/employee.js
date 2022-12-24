const employeeForm = document.getElementById("employee-info-form");
const employeeFormWindow = document.getElementById("employee-form-window");
const employeeAddBtn = document.getElementById("employee-add");
const employeeEditBtn = document.getElementById("employee-edit");
const employeeCloseBtn = document.getElementById("employee-close");
const employeeCancelBtn = document.getElementById("employee-cancel");
const employeesContainer = document.getElementById("employee-content");

let employeeId;

/**
 * @description Get the id of employee in the event
 * @param {object} event
 * @return {string} id of employee
 */
const getEmployeeId = (event) => {
	if (event.target) event = event.target;
	console.log(event);
	const currentEmployee = event.closest(".employee");
	let employeeId = currentEmployee.id;
	return employeeId;
};

/**
 * @description Create element to display a employee
 * @param {object} employee Details of employee
 * @return {object} element with employee details
 */
const createEmployeeElement = (employee) => {
	let opportunitiesValue = Object.values(employee.opportunities);
	let converted = Object.keys(employee.leads["converted"]).length;
	let ongoingLead =
		Object.keys(employee.leads["open"]).length +
		Object.keys(employee.leads["working"]).length;
	let closedWon = opportunitiesValue.filter((opportunity) => {
		opportunity.stage === "closed-win";
	}).length;
	let employeeElement = document.createElement("div");
	employeeElement.className = "employee";
	employeeElement.id = employee.email;
	employeeElement.innerHTML = `<span>${employee.id}</span>
									<span>${employee.name}</span>
									<span>${converted}</span>
									<span>${ongoingLead}</span>
									<span>${closedWon}</span>`;
	employeeElement.innerHTML += `<div class="options">
                        <i class="fa fa-edit" onclick="editEmployee(event)"></i>
                        <i class="fa fa-trash" onclick="deleteEmployee(event)"></i>
                    </div>`;
	return employeeElement;
};

const updateEmployees = async () => {
	let allEmployees = await getAllUsers();
	employeesContainer.replaceChildren();
	allEmployees.forEach(async (employeeId) => {
		let employeeDetails = await getSpecificEmployeeDetails(employeeId);
		console.log(employeeDetails);
		let employeeElement = createEmployeeElement(employeeDetails);
		employeesContainer.appendChild(employeeElement);
	});
};

/**
 * @description Get details from the form
 * @return {object} details of form
 */
const getEmployeeFormDetails = () => {
	let formDetails = {};
	formDetails.name = employeeForm.employeeName.value;
	formDetails.id = employeeForm.id.value;
	formDetails.title = employeeForm.empTitle.value;
	formDetails.personalEmail = employeeForm.personalEmail.value;
	formDetails.email = employeeForm.email.value;
	formDetails.phoneNo = employeeForm.phoneNo.value;
	return formDetails;
};

/**
 * @description Show form to edit the employee
 * @param {object} formDetails current details of employee
 */
const showEmployeeEditForm = (formDetails) => {
	console.log(formDetails);
	employeeForm.employeeName.value = formDetails.name;
	employeeForm.id.value = formDetails.id;
	employeeForm.empTitle.value = formDetails.title;
	employeeForm.personalEmail.value = formDetails.personalEmail;
	employeeForm.email.value = formDetails.email;
	employeeForm.phoneNo.value = formDetails.phoneNo;
	employeeAddBtn.disabled = "disabled";
	employeeAddBtn.classList.add("hide");
	employeeEditBtn.removeAttribute("disabled");
	employeeEditBtn.classList.remove("hide");
	employeeFormWindow.classList.remove("hide");
};

/**
 * @description Edit the employee
 * @param {object} event employee to edit
 */
const editEmployee = async (event) => {
	employeeId = getEmployeeId(event);
	console.log(employeeId);
	let formDetails = await getEmployeeDetails(employeeId, currentUserName);
	showEmployeeEditForm(formDetails);
};

/**
 * @description Delete employee selected
 * @param {object} event Event/ employee to be deleted
 */
const deleteEmployee = async (event) => {
	let employeeId = getEmployeeId(event);
	await deleteOldEmployee(employeeId, currentUserName);
	await updateEmployees();
	await updateContent("employee-container");
};

/**
 * @description Get if add or edit button is clicked
 * @param {object} event form which is submitted
 */
const addOrEditEmployee = async (event) => {
	const formDetails = await getEmployeeFormDetails();
	console.log(event.submitter);
	if (event.submitter.id === "employee-add") {
		await addNewEmployee(formDetails);
	} else {
		await deleteOldEmployee(employeeId, currentUserName);
		await addNewEmployee(formDetails, currentUserName);
	}
	await updateEmployees();
	await updateContent("employee-container");
	employeeFormWindow.classList.add("hide");
	employeeForm.reset();
};

/**
 * @description Show form where employee can be added
 */
const showAddEmployeeForm = () => {
	employeeFormWindow.classList.remove("hide");
	employeeAddBtn.removeAttribute("disabled");
	employeeAddBtn.classList.remove("hide");
	employeeEditBtn.disabled = "disabled";
	employeeEditBtn.classList.add("hide");
};

employeeCloseBtn.onclick = () => {
	employeeFormWindow.classList.add("hide");
};

employeeCancelBtn.onclick = () => {
	employeeFormWindow.classList.add("hide");
};

// console.log(getSpecificEmployeeDetails("john.doe@crms.com"));
