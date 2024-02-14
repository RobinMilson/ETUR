const report = {
    id: '2412',
    category: "Feedback",
    customerId: "1234",
    description: "This is a description",
    labels: ["label1", "label2"],
    owner: "Product Manager",
    assignedTo: "Jens Reiner",
    createdAt: "2020-01-01:12:00:00",
    editedAt: "2020-01-01:12:00:00",
    closedAt: "2020-01-01:12:00:00",
    state: "Open",
    priority: 1,
    comments: [
      {
        author: "Jens Reiner",
        message: "This is a comment",
        createdAt: "2020-01-01:12:00:00",
        type: 'developer',
      },
    ],
    closeReason: "This is a close reason",
    references: [
      {
        type: "github",
        url: "",
        issueNumber: 1
      }
    ]
  };