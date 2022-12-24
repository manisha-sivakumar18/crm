const contactForm = document.getElementById("contact-info-form");
const contactFormWindow = document.getElementById("contact-form-window");
const contactAddBtn = document.getElementById("contact-add");
const contactEditBtn = document.getElementById("contact-edit");
const contactCloseBtn = document.getElementById("contact-close");
const contactCancelBtn = document.getElementById("contact-cancel");
const contactsContainer = document.getElementById("contact-content");

let contactId;

/**
 * @description Get the id of contact in the event
 * @param {object} event
 * @return {string} id of contact
 */
const getContactId = (event) => {
	if (event.target) event = event.target;
	console.log(event);
	const currentContact = event.closest(".contact");
	let contactId = currentContact.id;
	return contactId;
};

/**
 * @description Create element to display a contact
 * @param {object} contact Details of contact
 * @return {object} element with contact details
 */
const createcontactElement = (contact) => {
	let contactElement = document.createElement("div");
	contactElement.className = "contact";
	contactElement.id = contact.email;
	contactElement.innerHTML = `<div class="info">
                    <span>${contact.firstName} ${contact.lastName}</span>
                    <span>${contact.account}</span>
                    <span>${contact.email}</span>
                </div>`;
	contactElement.innerHTML += `<div class="options">
                        <i class="fa fa-edit" onclick="editContact(event)"></i>
                        <i class="fa fa-trash" onclick="deleteContact(event)"></i>
                    </div>`;
	return contactElement;
};

const updateContacts = async () => {
	let allUserContacts;
	contactsContainer.replaceChildren();
	if (currentUserName === "admin@crms.com") {
		let allUsers = await getAllUsers();
		delete allUsers["admin@crms.com"];
		allUserContacts = [];
		for (i = 0; i < allUsers.length; i++) {
			let allContacts = await getSpecificUserContacts(allUsers[i]);
			allContacts = allContacts.contact;
			allContacts.forEach((contact) => {
				let contactElement = createcontactElement(contact);
				contactsContainer.appendChild(contactElement);
			});
		}
	} else {
		allUserContacts = await getSpecificUserContacts(currentUserName);
		allUserContacts = allUserContacts.contact;
		allUserContacts.forEach((contact) => {
			let contactElement = createcontactElement(contact);
			contactsContainer.appendChild(contactElement);
		});
	}
};

/**
 * @description Get details from the form
 * @return {object} details of form
 */
const getContactFormDetails = () => {
	let formDetails = {};
	formDetails.salutation = contactForm.salutation.value;
	formDetails.firstName = contactForm.firstName.value;
	formDetails.lastName = contactForm.lastName.value;
	formDetails.account = contactForm.account.value;
	formDetails.title = contactForm.contactTitle.value;
	formDetails.industry = contactForm.industry.value;
	formDetails.mobile = contactForm.mobile.value;
	formDetails.email = contactForm.email.value;
	return formDetails;
};

/**
 * @description Show form to edit the contact
 * @param {object} formDetails current details of contact
 */
const showContactEditForm = (formDetails) => {
	contactForm.salutation.value = formDetails.salutation;
	contactForm.firstName.value = formDetails.firstName;
	contactForm.lastName.value = formDetails.lastName;
	contactForm.account.value = formDetails.account;
	contactForm.contactTitle.value = formDetails.title;
	contactForm.industry.value = formDetails.industry;
	contactForm.mobile.value = formDetails.mobile;
	contactForm.email.value = formDetails.email;
	contactAddBtn.disabled = "disabled";
	contactAddBtn.classList.add("hide");
	contactEditBtn.removeAttribute("disabled");
	contactEditBtn.classList.remove("hide");
	contactFormWindow.classList.remove("hide");
};

/**
 * @description Edit the contact
 * @param {object} event contact to edit
 */
const editContact = async (event) => {
	contactId = getContactId(event);
	console.log(contactId);
	let formDetails = await getContactDetails(contactId, currentUserName);
	showContactEditForm(formDetails);
};

/**
 * @description Get if add or edit button is clicked
 * @param {object} event form which is submitted
 */
const addOrEditContact = async (event) => {
	const formDetails = await getContactFormDetails();
	console.log(event.submitter);
	if (event.submitter.id === "contact-add") {
		await addNewContact(formDetails, currentUserName);
	} else {
		await deleteOldContact(contactId, currentUserName);
		await addNewContact(formDetails, currentUserName);
	}
	await updateContacts();
	await updateContent("contact-container");

	contactFormWindow.classList.add("hide");
	contactForm.reset();
};

/**
 * @description Delete contact selected
 * @param {object} event Event/ contact to be deleted
 */
const deleteContact = async (event) => {
	let contactId = getContactId(event);
	await deleteOldContact(contactId, currentUserName);
	await updateContacts();
	await updateContent("contact-container");
};

/**
 * @description Show form where contact can be added
 */
const showAddContactForm = () => {
	contactFormWindow.classList.remove("hide");
	contactAddBtn.removeAttribute("disabled");
	contactAddBtn.classList.remove("hide");
	contactEditBtn.disabled = "disabled";
	contactEditBtn.classList.add("hide");
};

contactCloseBtn.onclick = () => {
	contactFormWindow.classList.add("hide");
};

contactCancelBtn.onclick = () => {
	contactFormWindow.classList.add("hide");
};

// updateContacts();
