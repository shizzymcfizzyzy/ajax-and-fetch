import isValid from "./email-validator";
import "../styles/style.css";

class Section {
  constructor(title, buttonText) {
    this.title = title;
    this.buttonText = buttonText;
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

    const inputEmail = document.createElement("input");

    inputEmail.type = "email";
    inputEmail.className = "input-email";
    inputEmail.placeholder = "email";
    inputEmail.id = "email";
    inputEmail.name = "email";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className =
      "app-section__button subscribe-button app-section__button--read-more";
    submitButton.textContent = this.buttonText;

    form.appendChild(inputEmail);
    form.appendChild(submitButton);
    joinProgram.appendChild(title);
    joinProgram.appendChild(subtitle);
    joinProgram.appendChild(form);

    submitButton.addEventListener("click", (event) => {
      event.preventDefault();

      const email = inputEmail.value;
      const isEmailValid = isValid(email);
    });

    const savedEmail = localStorage.getItem("subscriptionEmail");
    if (savedEmail) {
      inputEmail.value = savedEmail;
      submitButton.textContent = "Unsubscribe";
      inputEmail.classList.add("hide-input");
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

document.addEventListener("DOMContentLoaded", () => {
  const sectionCreator = new Section("Join Our Program", "Subscribe");
  const appContainer = document.getElementById("app-container");

  sectionCreator.populateCommunitySection();

  const footer = document.querySelector("footer");

  appContainer.insertBefore(sectionCreator.sectionElement, footer);

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
  };

  const inputEmail = document.getElementById("email");
  const submitButton = document.querySelector(".subscribe-button");
  let isRequestInProgress = false;

  function updateButtonStatus(isDisabled) {
    submitButton.disabled = isDisabled;
    if (isDisabled) {
      submitButton.style.opacity = 0.5;
    } else {
      submitButton.style.opacity = 1;
    }
  }

  submitButton.addEventListener("click", handleSubscription);

  const savedEmail = localStorage.getItem("subscriptionEmail");
  if (savedEmail) {
    inputEmail.value = savedEmail;
    submitButton.textContent = "Unsubscribe";
    inputEmail.classList.add("hide-input");
  }
});
