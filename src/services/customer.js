const customerArray = [
    {
        customerId : 1,
        email : "fakeEmail@mailig.com",
        firstName : "Vorname",
        lastName : "Nachname",
        password : "Password123",
        companyName : "PlanB"
    },
    {
        customerId : 2,
        email : "hansWurst@mailig.com",
        firstName : "Hans",
        lastName : "Wurst",
        password : "Password123",
        companyName : "BlanP"
    },
    {
        customerId : 3,
        email : "krasseEmail@mailig.com",
        firstName : "Asterix",
        lastName : "von Gallien",
        password : "Password123",
        companyName : "French"
    }
];

export function returnCustomers() {
    return customerArray;
};

export function createCustomer(customerId ,email, firstName, lastName, password, companyName) {
    let newCustomer = {customerId, email, firstName, lastName, password, companyName};
    customerArray.push(newCustomer);
    return customerArray;
}

export function returnCustomerById(customerId) {
    for (const customer of customerArray) {
        if(customerId == customer.customerId)
        return customer
      }
}

export function delCustomer(customerId){
    const customerIndex = customerArray.findIndex(x => x.customerId == customerId)
        if(customerIndex != -1){
            customerArray.splice(customerIndex, 1)
            return { error : "Kunde gelöscht" }
        }
        else{
            return { error : "Kunde nicht gelöscht" }
        }
}

export async function routes (fastify, options) {
    fastify.get('/customers', async (request, reply) => {
        return returnCustomers();
    });
    fastify.get('/customer/:id', async (request, reply) => {
        const customerId = request.params.id;
        return returnCustomerById(customerId);
    });
    fastify.post('/newcustomer', async (request, reply) => {
        const customerId = request.params.id;
        return createCustomer(request.body.customerId, request.body.email, request.body.firstName, request.body.lastName, request.body.password, request.body.companyName);
    });
    fastify.delete('/customer/:id', async (request, reply) => {
        const customerId = request.params.id;
        return delCustomer(customerId);
    });
  }
