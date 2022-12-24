const opportunityForm = document.getElementById("opportunity-info-form");
const opportunityFormWindow = document.getElementById(
	"opportunity-form-window"
);
const opportunityAddBtn = document.getElementById("opportunity-add");
const opportunityEditBtn = document.getElementById("opportunity-edit");
const opportunityCloseBtn = document.getElementById("opportunity-close");
const opportunityCancelBtn = document.getElementById("opportunity-cancel");
const opportunityContainer = document.getElementById("opportunity-content");

let opportunityId;

/**
 * @description Get the id of opportunity in the event
 * @param {object} event
 * @return {string} id of opportunity
 */
const getOpportunityId = (event) => {
	if (event.target) event = event.target;
	console.log(event);
	const currentOpportunity = event.closest(".opportunity");
	let opportunityId = currentOpportunity.id;
	return opportunityId;
};

/**
 * @description Create element to display a opportunity
 * @param {object} opportunity Details of opportunity
 * @return {object} element with opportunity details
 */
const createopportunityElement = (opportunity) => {
	let opportunityElement = document.createElement("div");
	opportunityElement.className = "opportunity";
	opportunityElement.id = opportunity.opportunityName;
	opportunityElement.innerHTML = `
                    <span>${opportunity.opportunityName}</span>
								<span>${opportunity.account}</span>
								<span>${opportunity.stage}</span>
								<span>${opportunity.closeDate}</span>
								<span>${opportunity.amount}</span>
								<div class="options">
									<i class="fa fa-edit" onclick="editOpportunity(event)"></i>
									<i class="fa fa-trash" onclick="deleteOpportunity(event)"></i>
								</div> `;
	return opportunityElement;
};

/**
 * @description Get details from the form
 * @return {object} details of form
 */
const getOpportunityFormDetails = () => {
	let formDetails = {};
	formDetails.opportunityName = opportunityForm.opportunityName.value;
	formDetails.account = opportunityForm.account.value;
	formDetails.amount = opportunityForm.amount.value;
	formDetails.closeDate = opportunityForm.closeDate.value;
	formDetails.stage = opportunityForm.stage.value;
	formDetails.probability = opportunityForm.probability.value;
	return formDetails;
};

/**
 * @description Show form to edit the opportunity
 * @param {object} formDetails current details of opportunity
 */
const showOpportunityEditForm = (formDetails) => {
	opportunityForm.opportunityName.value = formDetails.opportunityName;
	opportunityForm.account.value = formDetails.account;
	opportunityForm.amount.value = formDetails.amount;
	opportunityForm.closeDate.value = formDetails.closeDate;
	opportunityForm.stage.value = formDetails.stage;
	opportunityForm.probability.value = formDetails.probability;
	opportunityAddBtn.disabled = "disabled";
	opportunityAddBtn.classList.add("hide");
	opportunityEditBtn.removeAttribute("disabled");
	opportunityEditBtn.classList.remove("hide");
	opportunityFormWindow.classList.remove("hide");
};

/**
 * @description Edit the opportunity
 * @param {object} event opportunity to edit
 */
const editOpportunity = async (event) => {
	opportunityId = getOpportunityId(event);
	console.log(opportunityId);
	let formDetails = await getOpportunityDetails(opportunityId, currentUserName);
	showOpportunityEditForm(formDetails);
};

/**
 * @description Get if add or edit button is clicked
 * @param {object} event form which is submitted
 */
const addOrEditOpportunity = async (event) => {
	const formDetails = await getOpportunityFormDetails();
	console.log(event.submitter);
	if (event.submitter.id === "opportunity-add") {
		await addNewOpportunity(formDetails, currentUserName);
	} else {
		await deleteOldOpportunity(opportunityId, currentUserName);
		await addNewOpportunity(formDetails, currentUserName);
	}
	await updateOpportunities();
	await updateContent("opportunities-container");

	opportunityFormWindow.classList.add("hide");
	opportunityForm.reset();
};

const updateOpportunities = async () => {
	let allUserOpportunities;
	opportunityContainer.replaceChildren();

	if (currentUserName === "admin@crms.com") {
		let allUsers = await getAllUsers();
		delete allUsers["admin@crms.com"];
		allUserOpportunities = [];
		for (i = 0; i < allUsers.length; i++) {
			let allOpportunities = await getSpecificUserOpportunities(allUsers[i]);
			allOpportunities = allOpportunities.opportunities;
			allOpportunities.forEach((opportunity) => {
				let opportunityElement = createopportunityElement(opportunity);
				opportunityContainer.appendChild(opportunityElement);
			});
		}
		allUserOpportunities = allUserOpportunities[0];
	} else {
		allUserOpportunities = await getSpecificUserOpportunities(currentUserName);
		allUserOpportunities = allUserOpportunities.opportunities;
		allUserOpportunities.forEach((opportunity) => {
			let opportunityElement = createopportunityElement(opportunity);
			opportunityContainer.appendChild(opportunityElement);
		});
	}
	console.log(allUserOpportunities);
};

/**
 * @description Show form where opportunity can be added
 */
const showAddOpportunityForm = () => {
	opportunityFormWindow.classList.remove("hide");
	opportunityAddBtn.removeAttribute("disabled");
	opportunityAddBtn.classList.remove("hide");
	opportunityEditBtn.disabled = "disabled";
	opportunityEditBtn.classList.add("hide");
};

const deleteOpportunity = async (event) => {
	let opportunityId = getOpportunityId(event);
	await deleteOldOpportunity(opportunityId, currentUserName);
	await updateOpportunities();
	await updateContent("opportunities-container");
};

opportunityCloseBtn.onclick = () => {
	opportunityFormWindow.classList.add("hide");
};

opportunityCancelBtn.onclick = () => {
	opportunityFormWindow.classList.add("hide");
};
