const loginContainer = document.getElementById("login-container");
const userContainer = document.getElementById("user-container");
const adminNavigation = document.getElementById("admin-navigation");
const employeeNavigation = document.getElementById("employee-navigation");
const logout = document.getElementById("logout");
const currentUser = document.getElementById("current-user");
const mainContentContainer = document.getElementById("main-content-container");
let currentUserName;
/**
 * @description To diplay toast message
 * @param {string} message Message to be shown
 */
const displayToast = (message) => {
	let toastElement = document.getElementById("toast");
	document.getElementById("toast-content").innerHTML = message;
	toastElement.classList.toggle("hide");

	let timeoutId = setTimeout(() => {
		toastElement.classList.toggle("hide");
	}, 2500);
	document.getElementById("toast-exit").onclick = () => {
		toastElement.classList.toggle("hide");
		clearTimeout(timeoutId);
	};
};

const updateContent = (id) => {
	let contentToDisplay = document.getElementById(id);
	console.log(id);
	mainContentContainer.innerHTML = contentToDisplay.innerHTML;
};

document.getElementById("nav-list").onchange = async () => {
	let selectedValue = document.querySelector('input[name="nav"]:checked').value;
	if (selectedValue === "lead") {
		await updateContent("lead-container");
		await updateAllBuckets();
	} else if (selectedValue === "contact") {
		await updateContent("contact-container");
		await updateContacts();
	} else if (selectedValue === "opportunities") {
		await updateContent("opportunities-container");
		await updateOpportunities();
	} else {
		await updateContent("employee-container");
		await updateEmployees();
	}
};

/**
 * @description Togggle between dashboard and login page
 */
const toggleDashboardLogin = () => {
	loginContainer.classList.toggle("hide");
	userContainer.classList.toggle("hide");
};

/**
 * @description Show navigation bar for admin
 */
const showAdminNavigation = () => {
	document.getElementById("employee-label").classList.remove("hide");
	document.getElementById("add-lead").classList.add("hide");
	document.getElementById("add-contact").classList.add("hide");
	document.getElementById("add-opportunity").classList.add("hide");
};

/**
 * @description Show navigation bar for employee
 */
const showEmployeeNavigation = () => {
	document.getElementById("employee-label").classList.add("hide");
	document.getElementById("add-lead").classList.remove("hide");
	document.getElementById("add-contact").classList.remove("hide");
	document.getElementById("add-opportunity").classList.remove("hide");
	console.log(document.getElementById("employee-label"));
};

/**
 * @description Validate email and password entered by the user
 */
const validateLogin = async () => {
	let email = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let response = await validateUserDetails(email, password);
	if (response.status === 200) {
		let result = await response.json();
		toggleDashboardLogin();
		currentUserName = email;
		console.log(result.type);
		if (result.type === "admin") {
			showAdminNavigation();
			updateContent("lead" + "-container");
			await updateAllBuckets();
			await updateEmployees();
			await updateContacts();
			await updateOpportunities();
		} else {
			updateContent("lead" + "-container");

			await updateAllBuckets();
			await updateContacts();
			await updateOpportunities();
			showEmployeeNavigation();
		}
		document.getElementById("login-form").reset();
	} else if (response.status === 401) {
		displayToast("The email or password entered in invalid. Please try again.");
	} else if (response.status === 404) {
		displayToast("User not found. Try with different email or create new one.");
	}
};

currentUser.onclick = () => {
	logout.classList.toggle("hide");
};

logout.onclick = () => {
	toggleDashboardLogin();
};

document.addEventListener("click", (event) => {
	// if (event.target) event = event.target;
	console.log(event.path.includes(currentUser));
	if (!event.path.includes(currentUser) && event.target != currentUser) {
		logout.classList.add("hide");
	}
});
