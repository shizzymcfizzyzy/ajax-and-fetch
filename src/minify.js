import "../styles/style.css";
import e from "../personal-website-server-master/src/validate-email";
class Section {
  constructor(e, t) {
    (this.title = e),
      (this.buttonText = t),
      (this.sectionElement = this.createSection());
  }
  createSection() {
    let t = document.createElement("section");
    t.className = "app-section app-section--join-our-program";
    let i = document.createElement("h2");
    (i.className = "app-title"), (i.textContent = `${this.title}`);
    let a = document.createElement("h3");
    (a.className = "app-subtitle"),
      (a.textContent =
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
    let n = document.createElement("form");
    n.id = "subscribeForm";
    let s = document.createElement("input");
    (s.type = "email"),
      (s.className = "input-email"),
      (s.placeholder = "email"),
      (s.id = "email"),
      (s.name = "email");
    let l = document.createElement("button");
    (l.type = "submit"),
      (l.className =
        "app-section__button subscribe-button app-section__button--read-more"),
      (l.textContent = this.buttonText),
      n.appendChild(s),
      n.appendChild(l),
      t.appendChild(i),
      t.appendChild(a),
      t.appendChild(n),
      l.addEventListener("click", (t) => {
        t.preventDefault();
        let i = s.value;
        e(i);
      });
    let o = localStorage.getItem("subscriptionEmail");
    return (
      o &&
        ((s.value = o),
        (l.textContent = "Unsubscribe"),
        s.classList.add("hide-input")),
      t
    );
  }
  populateCommunitySection() {
    fetch("http://localhost:3000/community")
      .then((e) => e.json())
      .then((e) => {
        let t = document.querySelector(".app-section--community"),
          i = t.querySelector(".testimonials-container");
        e.forEach((e) => {
          let t = document.createElement("div");
          (t.id = e.id), (t.className = "testimonial");
          let a = document.createElement("img");
          (a.className = "testimonial-img"),
            (a.src = e.avatar),
            (a.alt = `${e.firstName} ${e.lastName}`);
          let n = document.createElement("p");
          (n.className = "testimonial-text"),
            (n.textContent =
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor.");
          let s = document.createElement("div");
          s.className = "testimonial-author";
          let l = document.createElement("div");
          (l.className = "testimonial-author-firstname"),
            (l.textContent = e.firstName);
          let o = document.createElement("div");
          (o.className = "testimonial-author-lastname"),
            (o.textContent = e.lastName);
          let r = document.createElement("div");
          (r.className = "testimonial-position"),
            (r.textContent = e.position),
            s.appendChild(l),
            s.appendChild(o),
            t.appendChild(a),
            t.appendChild(n),
            t.appendChild(s),
            t.appendChild(r),
            i.appendChild(t);
        });
      })
      .catch((e) => {
        console.error("Error fetching community data:", e);
      });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  let t = new Section("Join Our Program", "Subscribe"),
    i = document.getElementById("app-container");
  t.populateCommunitySection();
  let a = document.querySelector("footer");
  i.insertBefore(t.sectionElement, a);
  let n = () => {
      let t = s.value,
        i = e(t),
        a = "Subscribe" === l.textContent;
      if (i) {
        let n = new XMLHttpRequest();
        n.open("POST", a ? "/subscribe" : "/unsubscribe", !0),
          n.setRequestHeader("Content-Type", "application/json"),
          (n.onload = function () {
            200 === n.status
              ? (JSON.parse(n.responseText),
                a
                  ? (localStorage.setItem("subscriptionEmail", t),
                    (l.textContent = "Unsubscribe"),
                    s.classList.add("hide-input"),
                    alert("You have successfully subscribed!"))
                  : (localStorage.removeItem("subscriptionEmail"),
                    (s.value = ""),
                    (l.textContent = "Subscribe"),
                    s.classList.remove("hide-input"),
                    alert("You have successfully unsubscribed!")))
              : n.status > 400 &&
                alert("Failed to perform the action. Please try again later.");
          }),
          (n.onerror = function () {
            alert("An error occurred. Please try again later.");
          });
        let o = JSON.stringify({ email: t });
        n.send(o);
      } else alert("Invalid email address. Please try again");
    },
    s = document.getElementById("email"),
    l = document.querySelector(".subscribe-button");
  function o(e) {
    (l.disabled = e), e ? (l.style.opacity = 0.5) : (l.style.opacity = 1);
  }
  l.addEventListener("click", n);
  let r = localStorage.getItem("subscriptionEmail");
  r &&
    ((s.value = r),
    (l.textContent = "Unsubscribe"),
    s.classList.add("hide-input"));
});
