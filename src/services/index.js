import { returnCustomers, createCustomer, returnCustomerById, delCustomer } from "./customer.js"
import Fastify from "fastify"
import { routes } from './customer.js'
// Other code...

const fastify = Fastify({
    logger: true,
});
fastify.register(routes);

try {
    await fastify.listen({port: 3000});
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

// let randNo = Math.floor(Math.random() * 6) + 1;
// createCustomer(4 ,"newEmail@mail", "newFirstName", "newLastName", "newPassword", "newCompanyName");
// createCustomer(5 ,"nextNewEmail@mail", "nextNewFirstName", "nextnewLastName", "newNewPassword", "crazyNewCompanyName");
// createCustomer(6 ,"MailMail@mail", "Helmhut", "Kohlen", "newNewPassword", "El Chefe");
// delCustomer(randNo);
// returnCustomers();

