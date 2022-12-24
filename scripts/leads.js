const leadForm = document.getElementById("lead-info-form");
const leadFormWindow = document.getElementById("lead-form-window");
const leadAddBtn = document.getElementById("lead-add");
const leadEditBtn = document.getElementById("lead-edit");
const leadCloseBtn = document.getElementById("lead-close");
const leadCancelBtn = document.getElementById("lead-cancel");

let bucketName;
let leadId;
let allUserLeads;
/**
 * @description Get details from the form
 * @return {object} details of form
 */
const getLeadFormDetails = () => {
	let formDetails = {};
	formDetails.salutation = leadForm.salutation.value;
	formDetails.firstName = leadForm.firstName.value;
	formDetails.lastName = leadForm.lastName.value;
	formDetails.company = leadForm.company.value;
	formDetails.title = leadForm.leadTitle.value;
	formDetails.industry = leadForm.industry.value;
	formDetails.mobile = leadForm.mobile.value;
	formDetails.email = leadForm.email.value;
	formDetails.status = leadForm.status.value;
	return formDetails;
};

/**
 * @description Get the name of bucket in the event
 * @param {object} event
 * @return {string} name of bucket
 */
const getBucketName = (event) => {
	if (event.target) event = event.target;
	const currentBucket = event.closest(".lead-list");
	let bucketName = currentBucket.id;
	return bucketName;
};

/**
 * @description Get the id of lead in the event
 * @param {object} event
 * @return {string} id of lead
 */
const getLeadId = (event) => {
	if (event.target) event = event.target;
	const currentLead = event.closest(".lead");
	let leadId = currentLead.id;
	return leadId;
};

/**
 * @description Show form to edit the lead
 * @param {object} formDetails current details of lead
 */
const showLeadEditForm = (formDetails) => {
	leadForm.salutation.value = formDetails.salutation;
	leadForm.firstName.value = formDetails.firstName;
	leadForm.lastName.value = formDetails.lastName;
	leadForm.company.value = formDetails.company;
	leadForm.leadTitle.value = formDetails.title;
	leadForm.industry.value = formDetails.industry;
	leadForm.mobile.value = formDetails.mobile;
	leadForm.email.value = formDetails.email;
	leadForm.status.value = formDetails.status;
	leadAddBtn.disabled = "disabled";
	leadAddBtn.classList.add("hide");
	leadEditBtn.removeAttribute("disabled");
	leadEditBtn.classList.remove("hide");
	leadFormWindow.classList.remove("hide");
};

/**
 * @description Edit the lead
 * @param {object} event Lead to edit
 */
const editLead = async (event) => {
	bucketName = getBucketName(event);
	leadId = getLeadId(event);
	console.log(bucketName, leadId);
	let formDetails = await getLeadDetails(bucketName, leadId, currentUserName);
	showLeadEditForm(formDetails);
};

const deleteLead = async (event) => {
	let bucketName = getBucketName(event);
	let leadId = getLeadId(event);
	await deleteOldLead(bucketName, leadId, currentUserName);
	await updateAllBuckets();
};

/**
 * @description Get if add or edit button is clicked
 * @param {object} event form which is submitted
 */
const addOrEditLead = async (event) => {
	const formDetails = getLeadFormDetails();
	console.log(event.submitter);
	if (event.submitter.id === "lead-add") {
		await addNewLead(formDetails, currentUserName);
	} else {
		await deleteOldLead(bucketName, leadId, currentUserName);
		await addNewLead(formDetails, currentUserName);
	}
	await updateAllBuckets();
	leadFormWindow.classList.add("hide");
	leadForm.reset();
};

/**
 * @description Create element to display a lead
 * @param {object} lead Details of lead
 * @return {object} element with lead details
 */
const createLeadElement = (lead) => {
	let leadElement = document.createElement("div");
	leadElement.className = "lead";
	leadElement.id = lead.email;
	leadElement.draggable = "true";
	leadElement.innerHTML = `<div class="info">
                    <span>${lead.firstName} ${lead.lastName}</span>
                    <span>${lead.company}</span>
                    <span>${lead.email}</span>
                </div>`;
	leadElement.innerHTML += `<div class="options">
                        <i class="fa fa-edit" onclick="editLead(event)"></i>
                        <i class="fa fa-trash" onclick="deleteLead(event)"></i>
                    </div>`;
	leadElement.ondragover = (event) => {
		drag(event);
	};
	return leadElement;
};

const clearBucket = (bucketName) => {
	let currBucket = document.getElementById(bucketName);
	// console.log(allLeads);
	currBucket.replaceChildren();
};

/**
 * @description Update specific bucket with leads
 * @param {string} bucketName Name of bucket to be updated
 * @param {object} allLeads all leads in the bucket
 */
const updateBucket = (bucketName, allLeads) => {
	let currBucket = document.getElementById(bucketName);
	console.log(allLeads);
	// currBucket.replaceChildren();

	allLeads = Object.values(allLeads);
	console.log(allLeads);

	allLeads.forEach((lead) => {
		console.log(lead);
		let leadElement = createLeadElement(lead);
		currBucket.appendChild(leadElement);
	});
	console.log("hi");
};

/**
 * @description Update all buckets
 */
const updateAllBuckets = async () => {
	clearBucket("open");
	clearBucket("working");
	clearBucket("converted");
	clearBucket("notConverted");

	if (currentUserName === "admin@crms.com") {
		let allUsers = await getAllUsers();
		delete allUsers["admin@crms.com"];
		for (i = 0; i < allUsers.length; i++) {
			let allLeads = await getSpecificUserLeads(allUsers[i]);
			updateBucket("open", allLeads.lead[0]);
			updateBucket("working", allLeads.lead[1]);
			updateBucket("converted", allLeads.lead[2]);
			updateBucket("notConverted", allLeads.lead[3]);
		}
	} else {
		let allLeads = await getSpecificUserLeads(currentUserName);
		console.log(allLeads);
		updateBucket("open", allLeads.lead[0]);
		updateBucket("working", allLeads.lead[1]);
		updateBucket("converted", allLeads.lead[2]);
		updateBucket("notConverted", allLeads.lead[3]);
	}
};

/**
 * @description To allow drop event
 * @param {object} ev Event where drop is to be allowed
 */
function allowDrop(ev) {
	ev.preventDefault();
}

let dragObj;

/**
 * @description On drag of task set the name and progress of task dragged
 * @param {object} ev Event or task which is dragged
 */
function drag(ev) {
	if (ev.target) ev = ev.target;
	dragObj = ev;
	bucketName = getBucketName(dragObj);
	console.log(dragObj);
}

/**
 * @description On drop event, change the progress of task which is dragged
 * @param {object} event Event where the task is dropped
 */
const drop = async (event) => {
	let ev = event;
	if (ev.target) ev = ev.target;
	console.log(ev);
	if (ev.className !== "lead-list") {
		ev = ev.closest(".lead-list");
	}

	if (ev.id) {
		console.log(ev);
		console.log(dragObj);

		let leadId = await getLeadId(dragObj);
		let formDetails = await getLeadDetails(bucketName, leadId, currentUserName);
		console.log(leadId);
		await deleteOldLead(bucketName, leadId, currentUserName);
		formDetails.status = ev.id;
		await addNewLead(formDetails, currentUserName);
		updateAllBuckets();
	}
	event.preventDefault();
};
/**
 * @description Show form where user can add new lead
 */
const showAddLeadForm = () => {
	leadFormWindow.classList.remove("hide");
	leadAddBtn.removeAttribute("disabled");
	leadAddBtn.classList.remove("hide");
	leadEditBtn.disabled = "disabled";
	leadEditBtn.classList.add("hide");
};

leadCloseBtn.onclick = () => {
	leadFormWindow.classList.add("hide");
};

leadCancelBtn.onclick = () => {
	leadFormWindow.classList.add("hide");
};
