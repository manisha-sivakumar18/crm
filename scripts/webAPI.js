/**
 * @description Validate username and password entered by user
 * @param {string} username Username entered by user
 * @param {string} password Password entered by user
 * @return {object} response of validation
 */
const validateUserDetails = async (username, password) => {
	let request = {
		username: username,
		password: password,
	};
	let response = await fetch("http://localhost:8000/validate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response;
};

const addNewLead = async (formDetails, leadOwner) => {
	formDetails.leadOwner = leadOwner;
	let request = {
		formDetails: formDetails,
		leadOwner: leadOwner,
	};
	let response = await fetch("http://localhost:8000/addLead", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response;
};

const deleteOldLead = async (bucketName, leadId, leadOwner) => {
	let request = {
		bucketName: bucketName,
		leadId: leadId,
		leadOwner: leadOwner,
	};
	let response = await fetch("http://localhost:8000/deleteLead", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
};

const getLeadDetails = async (bucketName, leadId, leadOwner) => {
	let request = {
		bucketName: bucketName,
		leadId: leadId,
		leadOwner: leadOwner,
	};
	let response = await fetch("http://localhost:8000/getLeadDetails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};

const getSpecificUserLeads = async (leadOwner) => {
	console.log(leadOwner);
	let request = {
		leadOwner: leadOwner,
	};
	let response = await fetch("http://localhost:8000/getSpecificUserLeads", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};

const addNewContact = async (formDetails, contactOwner) => {
	formDetails.contactOwner = contactOwner;
	let request = {
		formDetails: formDetails,
		contactOwner: contactOwner,
	};
	console.log(request);
	let response = await fetch("http://localhost:8000/addContact", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response;
};

const getSpecificUserContacts = async (contactOwner) => {
	let request = {
		contactOwner: contactOwner,
	};
	let response = await fetch("http://localhost:8000/getSpecificUserContacts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};

const deleteOldContact = async (contactId, contactOwner) => {
	let request = {
		contactId: contactId,
		contactOwner: contactOwner,
	};
	let response = await fetch("http://localhost:8000/deleteContact", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
};

const getContactDetails = async (contactId, contactOwner) => {
	let request = {
		contactId: contactId,
		contactOwner: contactOwner,
	};
	console.log(request);
	let response = await fetch("http://localhost:8000/getContactDetails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};

const addNewOpportunity = async (formDetails, opportunityOwner) => {
	formDetails.opportunityOwner = opportunityOwner;
	let request = {
		formDetails: formDetails,
		opportunityOwner: opportunityOwner,
	};
	console.log(request);
	let response = await fetch("http://localhost:8000/addOpportunity", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response;
};

const getSpecificUserOpportunities = async (opportunityOwner) => {
	let request = {
		opportunityOwner: opportunityOwner,
	};
	let response = await fetch(
		"http://localhost:8000/getSpecificUserOpportunities",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(request),
		}
	);
	let result = await response.json();
	return result;
};

const deleteOldOpportunity = async (opportunityId, opportunityOwner) => {
	let request = {
		opportunityId: opportunityId,
		opportunityOwner: opportunityOwner,
	};
	let response = await fetch("http://localhost:8000/deleteOpportunity", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
};

const getOpportunityDetails = async (opportunityId, opportunityOwner) => {
	let request = {
		opportunityId: opportunityId,
		opportunityOwner: opportunityOwner,
	};
	console.log(request);
	let response = await fetch("http://localhost:8000/getOpportunityDetails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};

const addNewEmployee = async (formDetails) => {
	let request = {
		formDetails: formDetails,
	};
	console.log(request);
	let response = await fetch("http://localhost:8000/addEmployee", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	return response;
};

const getAllUsers = async () => {
	let response = await fetch("http://localhost:8000/getAllUsers", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify({}),
	});
	let result = await response.json();
	return result;
};

const getSpecificEmployeeDetails = async (employeeID) => {
	let request = {
		employeeID: employeeID,
	};
	let response = await fetch(
		"http://localhost:8000/getSpecificEmployeeDetails",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(request),
		}
	);
	let result = await response.json();
	return result;
};

const deleteOldEmployee = async (employeeId, employeeOwner) => {
	let request = {
		employeeId: employeeId,
	};
	let response = await fetch("http://localhost:8000/deleteEmployee", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
};

const getEmployeeDetails = async (employeeId, employeeOwner) => {
	let request = {
		employeeId: employeeId,
	};
	console.log(request);
	let response = await fetch("http://localhost:8000/getEmployeeDetails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(request),
	});
	let result = await response.json();
	return result;
};
