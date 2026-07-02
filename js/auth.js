document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      const showPassword = input.type === "password";
      input.type = showPassword ? "text" : "password";
      button.setAttribute("aria-label", showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
    });
  });

  document.querySelectorAll(".social-login button").forEach((button) => {
    button.addEventListener("click", () => {
      const toast = document.querySelector(".auth-toast");
      toast.querySelector("span").textContent =
        "Autentikasi sosial siap dihubungkan dengan backend.";
      toast.classList.add("is-visible");
      window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
    });
  });

  document.querySelectorAll(".js-auth-form").forEach((form) => {
    const validateField = (input) => {
      const field = input.closest(".field");
      if (!field) return input.checkValidity();
      const valid = input.checkValidity();
      field.classList.toggle("has-error", !valid);
      input.classList.toggle("is-invalid", !valid);
      return valid;
    };

    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field")?.classList.contains("has-error")) {
          validateField(input);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const inputs = [...form.querySelectorAll("input[required]")];
      const valid = inputs.every((input) => validateField(input));
      if (!valid) {
        inputs.find((input) => !input.checkValidity())?.focus();
        return;
      }

      const submit = form.querySelector(".auth-submit");
      const toast = document.querySelector(".auth-toast");
      submit.classList.add("is-loading");

      window.setTimeout(() => {
        submit.classList.remove("is-loading");
        const selectedRole = form.querySelector('input[name="role"]:checked')?.value;
        localStorage.setItem("revoraAuth", "true");
        localStorage.setItem(
          "revoraRole",
          selectedRole || localStorage.getItem("revoraRole") || "individual",
        );
        toast.classList.add("is-visible");
        window.setTimeout(() => {
          const redirect = new URLSearchParams(window.location.search).get("redirect");
          window.location.href = selectedRole
            ? `onboarding.html?role=${encodeURIComponent(selectedRole)}`
            : redirect || form.dataset.redirect;
        }, 700);
      }, 650);
    });
  });
});
