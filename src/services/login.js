import { getAllCustomers } from "./customers.js";

// Type is used to identify the kind of user.
// 1 -> Developer
// 2 -> Customer
// 3 -> Product Owner
class User {
    constructor(email, password, type) {
        this.email = email;
        this.password = password;
        this.type = type;
    }

    email;
    password;
    type;
}

const users = [];

export function init() {
    const usersNoCustomers = users.filter(x => x.type != 2);

    for (const customer of getAllCustomers()) {
        usersNoCustomers.push(new User(customer.email, customer.password, 2));
    }

    users = usersNoCustomers;
}

export async function loginRoutes (fastify, options) {
    const loginSchema = {
        schema: {
          body: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['email', 'password']
          }
        }
    }
    const signupSchema = {
        schema: {
          body: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' },
              type: { type: 'integer' },
            },
            required: ['email', 'password', 'type']
          }
        }
    }

    fastify.post('/login', loginSchema, async (request, reply) => {
        const user = users.find(x => 
            x.email == request.body.email &&
            x.password == request.body.password);

        if (user) {
            return { "type": user.type };
        }

        return reply.status(403).send();
    });

    fastify.post('/signup', signupSchema, async (request, reply) => {
        const newUser = new User(
            request.body.email,
            request.body.password,
            request.body.type
        );

        users.push(newUser);

        return newUser;
    });
}