document.addEventListener("DOMContentLoaded", () => {
  const goTopBtn = document.getElementById("go-top");
  const navbar = document.querySelector(".navbar");
  const sectionEls = document.querySelectorAll(".sections");
  const linkEls = document.querySelectorAll(".links");
  let timeout;

  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  let errorUsername = document.getElementById("error-username");
  let errorSubject = document.getElementById("error-subject");
  let errorEmail = document.getElementById("error-email");
  let errorMessage = document.getElementById("error-message");

  // document.getElementById("loading-container").style.display = "none";
  // document.getElementById("main-container").style.display = "block";
  
  if (window.innerWidth > 1024) {
    linkEls[0].style.color = "#f8ba00";
  }
  linkEls[0].style.setProperty("--afterWidth", "100%"); 


  window.addEventListener("scroll", () => {
    clearTimeout(timeout);
    timeout = setTimeout(handleScroll, 50);
  }, { passive: true });

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
    // show/hide
    if (scrollTop > 500) {
      goTopBtn.style.display = "block";
      navbar.style.backgroundColor = "#00265a";
    } else {
      goTopBtn.style.display = "none";
      navbar.style.backgroundColor = "#00265ae8";
    }
  
    // Navigation highlight
    if (document.querySelector(".sections").offsetWidth > 1024) {
      let current = "";
      sectionEls.forEach((item) => {
        if (scrollTop >= item.offsetTop - 60) {
          current = item.getAttribute("id");
        }
      });

      linkEls.forEach((item) => {
        item.style.setProperty("--afterWidth", 0);
        item.style.color = "darkgray";
        if (item.getAttribute("id") === `${current}-link`) {
          item.style.color = "#f8ba00";
          item.style.setProperty("--afterWidth", "100%");
        }
      });
    }
  }

  goTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if(window.innerWidth > 1024){
    linkEls.forEach((item) => {
      item.addEventListener("click", () => {
        document.querySelector(".mobil-navigation").style.display = "none";
        setTimeout(() => {
          history.replaceState("", document.title,
            window.location.origin +
              window.location.pathname +
              window.location.search
          );
        }, 100);
      });
    });
  }

  document.querySelectorAll(".mobil-links").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelector(".mobil-navigation")
        .classList.toggle("mobil-menu-handle");
    });
  });

  // document
  //   .querySelector(".mobil-navigation-icon")
  //   .addEventListener("click", (e) => {
  //     document
  //       .querySelector(".mobil-navigation")
  //       .classList.toggle("mobil-menu-handle");
  //   });



  let pattern = {
    username: /^.{3,50}[a-z0-9]$/,
    email: /([^ ]+)@([^ ]+)\.([a-z]{2,3})(\.[a-z]{2,3})?/,
    subject: /^.{5,50}\w$/,
    message: /^.{10,50}\w$/,
  };

  document.querySelectorAll(".inputs").forEach((item) => {
    item.addEventListener("keyup", (e) => {
      e.target.nextElementSibling.innerText = "";
    });
  });

  const sr = ScrollReveal({
    distance: "60px",
    duration: 2500,
    delay: 400,
    reset: true,
  });

  sr.reveal("#banner-img", { delay: 100, origin: "right" });
  sr.reveal("#banner-left", { delay: 100, origin: "left" });
  sr.reveal("#workflow-1", { delay: 100, origin: "left" });
  sr.reveal("#workflow-2", { delay: 100, origin: "right" });
  sr.reveal("#workflow-3", { delay: 100, origin: "left" });
  sr.reveal("#workflow-4", { delay: 100, origin: "right" });
  sr.reveal("#workflow-5", { delay: 100, origin: "left" });
  sr.reveal("#technologies-top", { delay: 100, origin: "top" });
  sr.reveal("#technologies-bottom", { delay: 100, origin: "bottom" });

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('sw.js').then(res => {
  //       console.log(res)
  //   }).catch((err) => {
  //       console.log(err)
  //   })
  // }

  document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    if (!username.value.match(pattern.username)) {
      username.focus();
      errorUsername.innerText =
        "Der Benutzername muss mehr als 2 Buchstaben haben!";
    } else if (!email.value.match(pattern.email)) {
      errorEmail.innerText = "E-Mail hat ein ungültiges Format!";
      email.focus();
    } else if (!subject.value.match(pattern.subject)) {
      subject.focus();
      errorSubject.innerText = "Der Betreff muss mehr als 5 Buchstaben haben!";
    } else if (!message.value.match(pattern.message)) {
      message.focus();
      errorMessage.innerText =
        "Die Nachricht muss mehr als 10 Buchstaben haben!";
    } else {
      emailjs.init({
        publicKey: "dfViWTkCiA7tGvXSm",
      });
      const data = {
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };
      emailjs.send("service_18hr2f9", "template_nr7p6b2", data).then(
        (response) => {
          alert("Ihre Nachricht wurde erfolgreich gesendet");
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
      document.getElementById("email-form").reset();
    }
  });
  
});
