const baseUrl = "http://localhost:3000";

async function getInProgressReports() {
    const reports = await (await fetch(`${baseUrl}/reports/filtered?state=In Bearbeitung`)).json();

    for (const report of reports) {
        if (!report.assignedTo) {
            continue;
        }

        const newElement = document.createElement("a");
        newElement.classList.add("report-box");
        newElement.classList.add("normal-text");
        newElement.href = `./reportView.html?reportId=${report.id}`;

        const categoryElement = document.createElement("p");
        categoryElement.textContent = report.category;

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = report.description;

        const stateElement = document.createElement("p");
        stateElement.textContent = report.state;

        const commentCountElement = document.createElement("p");
        commentCountElement.textContent = `${report.comments.length} Comments`;

        newElement.appendChild(categoryElement);
        newElement.appendChild(descriptionElement);
        newElement.appendChild(stateElement);
        newElement.appendChild(commentCountElement);

        let priorityBox;
        switch (report.priority) {
            case 1:
                priorityBox = document.getElementById("priority-1");
                priorityBox.appendChild(newElement);
                break;

            case 2:
                priorityBox = document.getElementById("priority-2");
                priorityBox.appendChild(newElement);
                break;

            case 3:
                priorityBox = document.getElementById("priority-3");
                priorityBox.appendChild(newElement);
                break;
        }
    }
}

window.onload = getInProgressReports;