import fetch from "node-fetch";
import { Octokit } from "octokit";

export async function gitRoutes(fastify, options) {
    const gitSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    reposOwner: { type: 'string' },
                    reposName: { type: 'string' },
                    title: { type: 'string' },
                    body: { type: 'string' },
                    labels: { type: 'array' },
                },
                required: ['title', 'body', 'labels', 'reposOwner', 'reposName']
            }
        }
    };

    fastify.post('/git/issue', gitSchema, async (request, reply) => {
        const { title, body, labels, reposOwner, reposName } = request.body;

        const octokit = new Octokit({
            request: { fetch },
            auth: `Bearer ${process.env.GITHUBTOKEN}`
        })

        const response = await octokit.request(`POST /repos/${reposOwner}/${reposName}/issues`, {
            owner: reposOwner,
            repo: reposName,
            title: title,
            body: body,
            labels: labels,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        return reply.status(response.status).send(response.data);
    });
}