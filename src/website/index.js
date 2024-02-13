const backendUrl = "http://localhost:3000";

async function loadCustomers() {
    const response = await fetch(`${backendUrl}/customers`, {
        method: "GET"
    });

    if (response.ok) {
        const responseBody = await response.json();
        const customerBox = document.getElementById("customer-box");

        for (const element of responseBody) {
            const customerField = document.createElement("p");

            customerField.textContent = `${element.firstName} ${element.lastName}`;
            customerField.value = element.id;

            customerBox.appendChild(customerField);
        }
    }
    else {
        console.log(await response.json());
    }
}

async function validateCustomerId() {
    const id = document.getElementById("customerNr").value;
    const response = await fetch(`${backendUrl}/customers/checkId/${id}`);

    if (response.ok) {
        const responseBody = await response.json();
        const validTag = document.getElementById("valid-tag");

        if (responseBody.valid) {
            validTag.textContent = "Valid";
            validTag.hidden = false;

            validTag.classList.add("green");
            validTag.classList.remove("red");
        }
        else {
            validTag.textContent = "Invalid";
            validTag.hidden = false;

            validTag.classList.add("red");
            validTag.classList.remove("green");
        }
    }
    else {
        console.log(await response.json());
    }
}

window.onload = loadCustomers;

document.getElementById("customerNr").addEventListener("change", validateCustomerId);
document.getElementById("customerNr").addEventListener("click", () => {
    const validTag = document.getElementById("valid-tag");
    validTag.hidden = true;
});