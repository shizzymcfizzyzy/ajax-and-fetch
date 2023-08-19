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
    const success = true;
    self.postMessage({ type: "subscriptionActionResult", payload: success });
  } else if (type === "analyticsData") {
    dataBatch.push(payload);

    if (dataBatch.length >= batchLimit) {
      sendBatchToServer(dataBatch);
      console.log("Worker sent analytics batch to server:", dataBatch);
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
