import "../styles/style.css";
import isValid from "./email-validator";

const worker = new Worker(new URL("./worker.js", import.meta.url));

let sectionCreator;

class Section {
  constructor(title, buttonText) {
    this.title = title;
    this.buttonText = buttonText;

    this.inputEmail = null;
    this.submitButton = null;
    this.sectionElement = this.createSection();
  }

  createSection() {
    const joinProgram = document.createElement("section");
    joinProgram.className = "app-section app-section--join-our-program";
    const title = document.createElement("h2");
    title.className = "app-title";
    title.textContent = `${this.title}`;
    const subtitle = document.createElement("h3");
    subtitle.className = "app-subtitle";
    subtitle.textContent =
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

    const form = document.createElement("form");
    form.id = "subscribeForm";

    this.inputEmail = document.createElement("input");
    this.inputEmail.type = "email";
    this.inputEmail.className = "input-email";
    this.inputEmail.placeholder = "email";
    this.inputEmail.id = "email";
    this.inputEmail.name = "email";

    this.submitButton = document.createElement("button");
    this.submitButton.type = "submit";
    this.submitButton.className =
      "app-section__button subscribe-button app-section__button--read-more";
    this.submitButton.textContent = this.buttonText;

    form.appendChild(this.inputEmail);
    form.appendChild(this.submitButton);
    joinProgram.appendChild(title);
    joinProgram.appendChild(subtitle);
    joinProgram.appendChild(form);

    this.submitButton.addEventListener("click", (event) => {
      event.preventDefault();

      const email = this.inputEmail.value;
      const isEmailValid = isValid(email);
      const isSubscribed = this.submitButton.textContent === "Subscribe";

      if (isEmailValid) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", isSubscribed ? "/subscribe" : "/unsubscribe", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
          if (xhr.status === 200) {
            const responsePayload = JSON.parse(xhr.responseText);
            if (isSubscribed) {
              localStorage.setItem("subscriptionEmail", email);
              sectionCreator.submitButton.textContent = "Unsubscribe";
              sectionCreator.inputEmail.classList.add("hide-input");
              alert("You have successfully subscribed!");
            } else {
              localStorage.removeItem("subscriptionEmail");
              sectionCreator.inputEmail.value = "";
              sectionCreator.submitButton.textContent = "Subscribe";
              sectionCreator.inputEmail.classList.remove("hide-input");
              alert("You have successfully unsubscribed!");
            }
          } else if (xhr.status > 400) {
            alert("Failed to perform the action. Please try again later.");
          }
        };

        xhr.onerror = function () {
          alert("An error occurred. Please try again later.");
        };

        const data = JSON.stringify({ email });
        xhr.send(data);
      } else {
        alert("Invalid email address. Please try again");
      }

      sendMessageToWorker("subscriptionAction", { email, isSubscribed });
    });

    const savedEmail = localStorage.getItem("subscriptionEmail");
    if (savedEmail) {
      this.inputEmail.value = savedEmail;
      this.submitButton.textContent = "Unsubscribe";
      this.inputEmail.classList.add("hide-input");
    }
    return joinProgram;
  }

  populateCommunitySection() {
    fetch("http://localhost:3000/community")
      .then((response) => response.json())
      .then((communityData) => {
        const communitySection = document.querySelector(
          ".app-section--community"
        );
        const testimonialsContainer = communitySection.querySelector(
          ".testimonials-container"
        );

        communityData.forEach((person) => {
          const testimonial = document.createElement("div");
          testimonial.id = person.id;
          testimonial.className = "testimonial";
          const avatar = document.createElement("img");
          avatar.className = "testimonial-img";
          avatar.src = person.avatar;
          avatar.alt = `${person.firstName} ${person.lastName}`;

          const text = document.createElement("p");
          text.className = "testimonial-text";

          text.textContent =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor.";

          const author = document.createElement("div");
          author.className = "testimonial-author";

          const firstName = document.createElement("div");
          firstName.className = "testimonial-author-firstname";
          firstName.textContent = person.firstName;

          const lastName = document.createElement("div");
          lastName.className = "testimonial-author-lastname";
          lastName.textContent = person.lastName;

          const position = document.createElement("div");
          position.className = "testimonial-position";
          position.textContent = person.position;

          author.appendChild(firstName);
          author.appendChild(lastName);
          testimonial.appendChild(avatar);
          testimonial.appendChild(text);
          testimonial.appendChild(author);
          testimonial.appendChild(position);
          testimonialsContainer.appendChild(testimonial);
        });
      })
      .catch((error) => {
        console.error("Error fetching community data:", error);
      });
  }
}

function sendMessageToWorker(type, payload) {
  worker.postMessage({ type, payload });
}

document.addEventListener("DOMContentLoaded", () => {
  sectionCreator = new Section("Join Our Program", "Subscribe");
  const appContainer = document.getElementById("app-container");

  sectionCreator.populateCommunitySection();

  const footer = document.querySelector("footer");

  appContainer.insertBefore(sectionCreator.sectionElement, footer);

  function sendAnalyticsDataToWorker(email, isSubscribed) {
    // eslint-disable-next-line no-unused-vars
    const analyticsData = {
      timestamp: Date.now(),
      data: [
        {
          eventType: "buttonClick",
          userEmail: email,
          subscriptionStatus: isSubscribed ? "Subscribed" : "Unsubscribed",
        },
      ],
    };

    fetch("http://localhost:3000/analytics/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analyticsData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Analytics data sent successfully to server:", data);
        sendMessageToWorker("analyticsDataSent");
      })
      .catch((error) => {
        console.error("Error sending analytics data:", error);
      });
    sendMessageToWorker("analyticsData", analyticsData);
  }

  const inputEmail = sectionCreator.inputEmail;
  const submitButton = sectionCreator.submitButton;

  const handleSubscription = () => {
    const email = inputEmail.value;
    const isEmailValid = isValid(email);
    const isSubscribed = submitButton.textContent === "Subscribe";

    if (isEmailValid) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", isSubscribed ? "/subscribe" : "/unsubscribe", true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = function () {
        if (xhr.status === 200) {
          const responsePayload = JSON.parse(xhr.responseText);
          if (isSubscribed) {
            localStorage.setItem("subscriptionEmail", email);
            submitButton.textContent = "Unsubscribe";
            inputEmail.classList.add("hide-input");
            alert("You have successfully subscribed!");
          } else {
            localStorage.removeItem("subscriptionEmail");
            inputEmail.value = "";
            submitButton.textContent = "Subscribe";
            inputEmail.classList.remove("hide-input");
            alert("You have successfully unsubscribed!");
          }
          sendAnalyticsDataToWorker(email, isSubscribed);
        } else if (xhr.status > 400) {
          alert("Failed to perform the action. Please try again later.");
        }
      };

      xhr.onerror = function () {
        alert("An error occurred. Please try again later.");
      };

      const data = JSON.stringify({ email });
      xhr.send(data);
    } else {
      alert("Invalid email address. Please try again");
    }

    sendMessageToWorker("subscriptionAction", { email, isSubscribed });
  };

  submitButton.addEventListener("click", handleSubscription);

  const savedEmail = localStorage.getItem("subscriptionEmail");
  if (savedEmail) {
    inputEmail.value = savedEmail;
    submitButton.textContent = "Unsubscribe";
    inputEmail.classList.add("hide-input");
  }

  inputEmail.addEventListener("input", (event) => {
    const email = event.target.value;
    sendMessageToWorker("emailInput", email);
  });

  worker.addEventListener("message", (event) => {
    const { type, payload } = event.data;

    if (type === "emailValidationResult") {
      const isEmailValid = payload;
    } else if (type === "subscriptionActionResult") {
      const success = payload;
      if (success) {
        console.log("Successful subscription");
      } else {
        console.log("Subscription failed");
      }
    } else if (type === "analyticsDataSent") {
      console.log("Analytics data sent successfully to server");
    }
  });
});
