import { validateCustomerId } from "./customers.js";

let customerBaseId = 10000;

function getNewReportId() {
    customerBaseId = customerBaseId + 1;

    return `ETUR-R-${customerBaseId}`;
};

class Report {
    constructor(
        category,
        customerId,
        description,
        labels,
        owner,
        assignedTo,
        state,
        priority,
        comments,
        closeReason,
        references
    ) {
        const dateNow = new Date();

        this.id = getNewReportId();
        this.category = category;
        this.customerId = customerId;
        this.description = description;
        this.labels = labels ? labels : [];
        this.owner = owner;
        this.assignedTo = assignedTo;
        this.createdAt = dateNow;
        this.editedAt = dateNow;
        this.state = state;
        this.priority = priority;
        this.comments = comments ? comments : [];
        this.closeReason = closeReason;
        this.references = references ? references : [];
    }

    id;
    category;
    customerId;
    description;
    labels;
    owner;
    assignedTo;
    createdAt;
    editedAt;
    closedAt;
    state;
    priority;
    comments;
    closeReason;
    references;
}

class Comment {
    constructor(author, message, type) {
        this.author = author;
        this.message = message;
        this.type = type;
        this.createdAt = new Date();
    }

    author;
    message;
    createdAt;
    type;
}

class Reference {
    constructor(type, url, issueNumber) {
        this.type = type;
        this.url = url;
        this.issueNumber = issueNumber;
    }

    type;
    url;
    issueNumber;
}

const reports = [];

export async function reportRoutes(fastify, options) {
    const reportSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    category: { type: 'string' },
                    customerId: { type: 'string' },
                    description: { type: 'string' },
                    labels: { type: 'array' },
                    owner: { type: 'string' },
                    assignedTo: { type: 'string' },
                    createdAt: { type: 'string' },
                    editedAt: { type: 'string' },
                    closedAt: { type: 'string' },
                    state: { type: 'string' },
                    priority: { type: 'integer' },
                    comments: { type: 'object' },
                    closeReason: { type: 'string' },
                    references: { type: 'object' },
                },
                required: [
                    'category',
                    'customerId',
                    'description',
                    'owner',
                    'assignedTo',
                    'state',
                    'priority']
            }
        }
    };
    const reportUpdateSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    description: { type: 'string' },
                    value: { type: 'string' },
                },
                required: ['id', 'value']
            }
        }
    };
    const reportCommentSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    author: { type: 'string' },
                    message: { type: 'string' },
                    type: { type: 'string' },
                },
                required: ['id', 'author', 'message', 'type']
            }
        }
    };

    fastify.post('/reports', reportSchema, async (request, reply) => {
        const isValid = validateCustomerId(request.body.customerId);

        if (isValid) {
            const newReport = new Report(
                request.body.category,
                request.body.customerId,
                request.body.description,
                request.body.labels,
                request.body.owner,
                request.body.assignedTo,
                request.body.state,
                request.body.priority,
                request.body.comments,
                request.body.customerId,
                request.body.closeReason,
                request.body.references
            );

            reports.push(newReport);
            return newReport;
        }

        return reply.code(400).send();
    });

    fastify.get('/reports', async (request, response) => {
        return reports;
    });

    fastify.get('/reports/filtered', async (request, response) => {
        let filteredReports = [];

        if (request.query.state) {
            filteredReports = reports.filter(x => x.state == request.query.state);
        }
        if (request.query.category) {
            filteredReports = filteredReports.length == 0
                ? reports.filter(x => x.category == request.query.category)
                : filteredReports.filter(x => x.category == request.query.category);
        }
        if (request.query.priority) {
            filteredReports = filteredReports.length == 0
                ? reports.filter(x => x.priority === Number(request.query.priority))
                : filteredReports.filter(x => x.priority === Number(request.query.priority));
        }

        return filteredReports;
    });

    fastify.get('/reports/:id', async (request, response) => {
        return reports.filter(x => x.customerId == request.params.id);
    });

    fastify.get('/reports/assigned/:name', async (request, response) => {
        return reports.filter(x => x.assignedTo == request.params.name);
    });

    fastify.put('/reports/status', reportUpdateSchema, async (request, response) => {
        const index = reports.findIndex(x => x.id == request.body.id);

        if (index >= 0) {
            const reportForUpdate = reports.splice(index, 1)[0];

            if (reportForUpdate) {
                reportForUpdate.state = request.body.value;
                reportForUpdate.lastEdited = new Date();

                if (request.body.description &&
                    (request.body.value == "Closed" ||
                        request.body.value == "Fertig")) {
                    reportForUpdate.closeReason = request.body.description
                        ? request.body.description
                        : reportForUpdate.closeReason;
                }
                else if (request.body.description) {
                    reportForUpdate.description = request.body.description
                        ? request.body.description
                        : reportForUpdate.description;
                }

                reports.push(reportForUpdate);
            }

            return reportForUpdate;
        }
        else {
            return response.status(400).send();
        }
    });

    fastify.put('/reports/priority', reportUpdateSchema, async (request, response) => {
        const index = reports.findIndex(x => x.id == request.body.id);

        if (index >= 0) {
            const reportForUpdate = reports.splice(index, 1)[0];

            if (reportForUpdate) {
                reportForUpdate.priority = Number(request.body.value);
                reportForUpdate.lastEdited = new Date();

                reports.push(reportForUpdate);
            }

            return reportForUpdate;
        }
        else {
            return response.status(400);
        }
    });

    fastify.get('/reports/comments/:id', async (request, response) => {
        const report = reports.find(x => x.id == request.params.id);

        if (report) {
            return report.comments;
        }

        return response.code(400).send();
    });

    fastify.post('/reports/comments', reportCommentSchema, async (request, response) => {
        const index = reports.findIndex(x => x.id == request.body.id);

        if (index >= 0) {
            const reportForUpdate = reports.splice(index, 1)[0];

            if (reportForUpdate) {
                const comment = new Comment(
                    request.body.author,
                    request.body.message,
                    request.body.type);

                reportForUpdate.comments.push(comment);
                reportForUpdate.lastEdited = new Date();

                reports.push(reportForUpdate);
            }

            return reportForUpdate;
        }
        else {
            return response.status(400);
        }
    });
}