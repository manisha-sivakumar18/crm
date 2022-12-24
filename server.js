var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var path = require("path");

var allUsers = {};
var allLeads = {};
var allContacts = {};
var allOpportunities = {};

let app = express();
const PORT = 8000;

app.use("/", express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let readUsersFile = () => {
	allUsers = JSON.parse(fs.readFileSync("./data/users.json"));
};

let readLeadsFile = () => {
	allLeads = JSON.parse(fs.readFileSync("./data/leads.json"));
};

let readContactsFile = () => {
	allContacts = JSON.parse(fs.readFileSync("./data/contacts.json"));
};

let readOpportunitiesFile = () => {
	allOpportunities = JSON.parse(fs.readFileSync("./data/opportunities.json"));
};

let writeLeadsFile = () => {
	const leadsString = JSON.stringify(allLeads);
	fs.writeFile("./data/leads.json", leadsString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		}
	});
};

let writeContactsFile = () => {
	const contactsString = JSON.stringify(allContacts);
	fs.writeFile("./data/contacts.json", contactsString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		}
	});
};

let writeOpportunitiesFile = () => {
	const opportunitiesString = JSON.stringify(allOpportunities);
	fs.writeFile("./data/opportunities.json", opportunitiesString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		}
	});
};

let writeUsersFile = () => {
	const userString = JSON.stringify(allUsers);
	fs.writeFile("./data/users.json", userString, (err) => {
		if (err) {
			console.log("Error writing file", err);
		}
	});
};

let createLeadTemplate = (email) => {
	readLeadsFile();
	allLeads[email] = {};
	allLeads[email]["open"] = {};
	allLeads[email]["working"] = {};
	allLeads[email]["converted"] = {};
	allLeads[email]["notConverted"] = {};
	writeLeadsFile();
};

let createContactTemplate = (email) => {
	readLeadsFile();
	allContacts[email] = {};
	writeLeadsFile();
};

let createOpportunityTemplate = (email) => {
	readLeadsFile();
	allLeads[email]["open"] = {};
	allLeads[email]["working"] = {};
	allLeads[email]["converted"] = {};
	allLeads[email]["notConverted"] = {};
	writeLeadsFile();
};

app.post("/validate", async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	await readUsersFile();
	if (username in allUsers) {
		if (password === allUsers[username].password) {
			res.status(200).json({
				message: "Success",
				username: allUsers[username].name,
				type: allUsers[username].type,
			});
		} else {
			res.status(401).json({ message: "Incorrect Password" });
		}
	} else {
		res.status(404).json({ message: "User not found" });
	}
});

app.post("/addLead", async (req, res) => {
	await readLeadsFile();
	let formDetails = req.body.formDetails;
	let leadOwner = req.body.leadOwner;
	allLeads[leadOwner][formDetails.status][formDetails.email] = formDetails;
	writeLeadsFile();
	console.log(allLeads);
	res.json();
});

app.post("/deleteLead", async (req, res) => {
	await readLeadsFile();
	let status = req.body.bucketName;
	let leadId = req.body.leadId;
	let leadOwner = req.body.leadOwner;
	delete allLeads[leadOwner][status][leadId];
	writeLeadsFile();
	res.json();
});

app.post("/getLeadDetails", async (req, res) => {
	await readLeadsFile();
	let status = req.body.bucketName;
	let leadId = req.body.leadId;
	let leadOwner = req.body.leadOwner;
	let formDetails = allLeads[leadOwner][status][leadId];
	res.json(formDetails);
});

app.post("/getSpecificUserLeads", async (req, res) => {
	await readLeadsFile();
	let leadOwner = req.body.leadOwner;
	let leadDetails = Object.values(allLeads[leadOwner]);
	let result = {
		lead: leadDetails,
	};
	res.json(result);
});

app.post("/addContact", async (req, res) => {
	await readContactsFile();
	console.log(req.body);
	let formDetails = req.body.formDetails;
	let contactOwner = req.body.contactOwner;
	allContacts[contactOwner][formDetails.email] = formDetails;
	writeContactsFile();
	res.json();
});

app.post("/getSpecificUserContacts", async (req, res) => {
	await readContactsFile();
	let contactOwner = req.body.contactOwner;
	let contactDetails = Object.values(allContacts[contactOwner]);
	let result = {
		contact: contactDetails,
	};
	res.json(result);
});

app.post("/deleteContact", async (req, res) => {
	await readContactsFile();
	let contactId = req.body.contactId;
	let contactOwner = req.body.contactOwner;
	delete allContacts[contactOwner][contactId];
	writeContactsFile();
	res.json();
});

app.post("/getContactDetails", async (req, res) => {
	await readContactsFile();
	let contactId = req.body.contactId;
	let contactOwner = req.body.contactOwner;
	let formDetails = allContacts[contactOwner][contactId];
	console.log(req.body);
	res.json(formDetails);
});

app.post("/addOpportunity", async (req, res) => {
	await readOpportunitiesFile();
	console.log(req.body);
	let formDetails = req.body.formDetails;
	let opportunityOwner = req.body.opportunityOwner;
	allOpportunities[opportunityOwner][formDetails.opportunityName] = formDetails;
	writeOpportunitiesFile();
	res.json();
});

app.post("/getSpecificUserOpportunities", async (req, res) => {
	await readOpportunitiesFile();
	let opportunityOwner = req.body.opportunityOwner;
	let opportunityDetails = Object.values(allOpportunities[opportunityOwner]);
	let result = {
		opportunities: opportunityDetails,
	};
	res.json(result);
});

app.post("/deleteOpportunity", async (req, res) => {
	await readOpportunitiesFile();
	let opportunityId = req.body.opportunityId;
	let opportunityOwner = req.body.opportunityOwner;
	delete allOpportunities[opportunityOwner][opportunityId];
	writeOpportunitiesFile();
	res.json();
});

app.post("/getOpportunityDetails", async (req, res) => {
	await readOpportunitiesFile();
	let opportunityId = req.body.opportunityId;
	let opportunityOwner = req.body.opportunityOwner;
	let formDetails = allOpportunities[opportunityOwner][opportunityId];
	console.log(req.body);
	res.json(formDetails);
});

app.post("/addEmployee", async (req, res) => {
	await readUsersFile();
	let formDetails = req.body.formDetails;
	formDetails.type = "employee";
	formDetails.password = "crms@123";
	allUsers[formDetails.email] = formDetails;
	writeUsersFile();
	createLeadTemplate(formDetails.email);
	createContactTemplate();
	createOpportunityTemplate();
	res.json();
});

app.post("/getAllUsers", async (req, res) => {
	readUsersFile();
	let allEmployees = allUsers;
	delete allEmployees["admin@crms.com"];
	allEmployees = Object.keys(allEmployees);
	res.json(allEmployees);
});

app.post("/getSpecificEmployeeDetails", async (req, res) => {
	await readUsersFile();
	let employeeID = req.body.employeeID;
	let employeeDetails = allUsers[employeeID];
	await readLeadsFile();
	employeeDetails["leads"] = allLeads[employeeID];
	await readContactsFile();
	employeeDetails["contacts"] = allContacts[employeeID];
	await readOpportunitiesFile();
	employeeDetails["opportunities"] = allOpportunities[employeeID];
	res.json(employeeDetails);
});

app.post("/deleteEmployee", async (req, res) => {
	await readUsersFile();
	delete allUsers[req.body.employeeId];
	writeUsersFile();
	res.json();
});

app.post("/getEmployeeDetails", async (req, res) => {
	await readUsersFile();
	let employeeId = req.body.employeeId;
	let formDetails = allUsers[employeeId];
	res.json(formDetails);
});

app.get("*", (req, res) => {
	res.status(502).json({ Error: "Not a valid endpoint" });
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
