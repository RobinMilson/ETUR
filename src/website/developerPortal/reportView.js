const baseUrl = "http://localhost:3000";
let websiteReport;

async function getCurrentReportInformation() {
    const reportId = document.location.href.split("?")[1].replace("reportId=", "");

    websiteReport = await ((await fetch(`${baseUrl}/reports/${reportId}`)).json());

    if (websiteReport) {
        const reportElement = document.createElement("p");
        reportElement.textContent = JSON.stringify(websiteReport);

        document.getElementById("report-content-box").appendChild(reportElement);
    }
}

async function createGitHubIssue() {
    if (!websiteReport.labels.find(x => x == websiteReport.category)) {
        websiteReport.labels.push(websiteReport.category);
    }

    const backendResponse = await fetch(`${baseUrl}/git/issue`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            "reposOwner": "RobinMilson",
            "reposName": "ETUR",
            "title": `${websiteReport.category}-${websiteReport.customerId}-${websiteReport.id}`,
            "body": websiteReport.description,
            "labels": JSON.stringify(websiteReport.labels)
        }
    });

    if (backendResponse.ok) {
        alert("GitHub Issue has been successfully created.");
    }
    else {
        const err = await backendResponse.json();

        console.log(err);
        alert(JSON.stringify(err));
    }
}

document.getElementById("turn-github-issue").addEventListener("click", createGitHubIssue);
window.onload = getCurrentReportInformation;