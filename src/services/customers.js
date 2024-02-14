let customerBaseId = 10000;

function getNewCustomerId() {
    customerBaseId = customerBaseId + 1;

    return `ETUR-CN-${customerBaseId}`;
};

class Customer {
    constructor(email, firstName, lastName, companyName, password) {
        this.id = getNewCustomerId();
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.password = password;
    }

    id = '';
    email = '';
    firstName = '';
    lastName = '';
    companyName = '';
    password = '';
};

const customers = [];

export function createCustomer(
    email, 
    firstName, 
    lastName, 
    companyName, 
    password)
{
    const newCustomer = new Customer(
        email, firstName, lastName, companyName, password
    );

    customers.push(newCustomer);

    return newCustomer;
}

export function getAllCustomers() {
    return customers;
}

export function getCustomer(id) {
    return customers.find(x => x.id == id);
}

export function deleteCustomer(id) {
    const isValid = validateCustomerId(id);

    if (isValid) {
        const index = customers.findIndex(x => x.id == id);
        customers.splice(index, 1);
    }
}

export function validateCustomerId(id) {
    const pattern = /ETUR-CN-\w+/;
    let isValid = pattern.test(id);

    if (isValid) {
        const index = customers.findIndex(x => x.id == id);

        isValid = index >= 0;
    }

    return isValid;
}

export async function routes (fastify, options) {
    const customerSchema = {
        schema: {
          body: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              companyName: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['email', 'firstName', 'lastName', 'companyName', 'password']
          }
        }
    }

    fastify.get('/customers', async (request, reply) => {
        return getAllCustomers();
    });

    fastify.get('/customers/:id', async (request, reply) => {
        return getCustomer(request.params.id);
    });

    fastify.get('/customers/checkId/:id', async (request, reply) => {
        const isValid = validateCustomerId(request.params.id);
        return { "valid": isValid };
    });

    fastify.post('/customers', customerSchema, async (request, reply) => {
        return createCustomer(
            request.body.email,
            request.body.firstName,
            request.body.lastName,
            request.body.companyName,
            request.body.password);
    });

    fastify.delete('/customers/:id', async (request, reply) => {
        return deleteCustomer(request.params.id);
    });
}