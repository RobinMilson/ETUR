const backendUrl = "http://localhost:3000";

class CustomerDto {
    constructor(formObject) {
        this.email = formObject.email.value;
        this.firstName = formObject.firstName.value;
        this.lastName = formObject.lastName.value;
        this.companyName = formObject.companyName.value;
        this.password = formObject.password.value;
    }

    email;
    firstName;
    lastName;
    companyName;
    password;
}

async function customerDataSubmit(formObject, event) {
    event.preventDefault();

    const newCustomer = new CustomerDto(formObject);

    const response = await fetch(`${backendUrl}/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer)
    });

    if (response.ok) {
        alert("Der Benutzer wurde erfolgreich erstellt!");
    }
    else {
        console.log(await response.json())
    }
}