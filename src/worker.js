const { default: isValid } = require("./email-validator");

const batchLimit = 5;
let dataBatch = [];

self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  if (type === "emailInput") {
    const email = payload;
    const isEmailValid = isValid(email);
    self.postMessage({ type: "emailValidationResult", payload: isEmailValid });
  } else if (type === "subscriptionAction") {
    const { email, isSubscribed } = payload;
    // Your subscription action logic here
    const success = true; // Replace with actual success status
    self.postMessage({ type: "subscriptionActionResult", payload: success });
  } else if (type === "analyticsData") {
    // Push the incoming analytics data to the batch
    dataBatch.push(payload);

    // Check if the batch size has reached the limit
    if (dataBatch.length >= batchLimit) {
      // Send the batch of data to the server
      sendBatchToServer(dataBatch);
      console.log("Worker sent analytics batch to server:", dataBatch);
      // Clear the batch
      dataBatch = [];
    }
  }
});

function sendBatchToServer(batch) {
  fetch("http://localhost:3000/analytics/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(batch),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send analytics batch to the server");
      }
    })
    .catch((error) => {
      console.error("Error sending analytics batch:", error);
    });
}
