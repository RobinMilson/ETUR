import { createCustomer, getAllCustomers, getCustomer, deleteCustomer, validateCustomerId, routes } from "./customers.js";
import Fastify from "fastify";
import Cors from '@fastify/cors'

const fastify = Fastify({
    logger: true
});

fastify.register(routes);
fastify.register(Cors, {
    origin: '*'
});

try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
}