import { routes } from "./customers.js";
import { reportRoutes } from "./reports.js";
import { loginRoutes } from "./logIn.js";
import { gitRoutes } from "./git.js";
import Fastify from "fastify";
import Cors from '@fastify/cors'
import Dotenv from "dotenv";

Dotenv.config();

const fastify = Fastify({
    logger: true,
});

fastify.register(routes);
fastify.register(reportRoutes);
fastify.register(loginRoutes);
fastify.register(gitRoutes);
fastify.register(Cors, {
    origin: '*'
});

try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
}