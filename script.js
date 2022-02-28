(() => {
  // DOM Node's
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("cPassword");

  const form = document.querySelector(".form");
  const submitBtn = document.querySelector(".form__button");

  // Core Validation Logic
  function validate(errorHandler, identifier, id, required, min, max, equalTo, regex) {
    let message = "";

    required && identifier.value.length <= 0
      ? ((message = required["message"]), errorHandler && errorHandler(id, message))
      : min && identifier.value.length < min["value"]
      ? ((message = min["message"]), errorHandler && errorHandler(id, message))
      : max && identifier.value.length > max["value"]
      ? ((message = max["message"]), errorHandler && errorHandler(id, message))
      : equalTo && identifier.value != equalTo["value"]
      ? ((message = equalTo["message"]), errorHandler && errorHandler(id, message))
      : regex && !identifier.value.match(regex["pattern"])
      ? ((message = regex["message"]), errorHandler && errorHandler(id, message))
      : "";

    return message;
  }

  // Criteria
  const criteria = {
    // userName
    userName(errorHandler) {
      return validate(
        errorHandler,
        username,
        "username",
        { message: "Name must have a value" },
        { value: 5, message: "Name Should not be less than 5" },
        { value: 30, message: "Name Should not be more than 30" },
        "",
        {
          pattern: /^[a-zA-Z0-9_]{6,15}$/,
          message: "Username must contain only letters and numbers",
        }
      );
    },
    // userEmail
    userEmail(errorHandler) {
      return validate(
        errorHandler,
        email,
        "email",
        { message: "Email must have a value" },
        "",
        "",
        "",
        {
          pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          message: "Insert a valid email",
        }
      );
    },
    // userPassword
    userPassword(errorHandler) {
      return validate(
        errorHandler,
        password,
        "password",
        { message: "Password must have a value" },
        { value: 8, message: "Password Should not be less than 8 charracters" },
        { value: 20, message: "Email Should not be more than 20 charracters" }
      );
    },
    //userCPassword
    userCPassword(errorHandler) {
      return validate(
        errorHandler,
        confirmPassword,
        "cPassword",
        { message: "Password must have a value" },
        { value: 8, message: "Password Should not be less than 8 charracters" },
        { value: 20, message: "Email Should not be more than 20 charracters" },
        { value: password.value, message: "Password doesn't match" }
      );
    },
  };

  // Evaluating All Inputs
  function evaluateAll() {
    let result = true;

    if (criteria.userName(errorUIHandler)) {
      result = false;
    }
    if (criteria.userEmail(errorUIHandler)) {
      result = false;
    }
    if (criteria.userPassword(errorUIHandler)) {
      result = false;
    }
    if (criteria.userCPassword(errorUIHandler)) {
      result = false;
    }

    return result;
  }

  // Update inputs state on errors
  function errorUIHandler(identifier, message) {
    document.getElementById(identifier).classList.add("errorClass");
    document.getElementById(identifier).value = "";
    document.getElementById(identifier).placeholder = message;
    form.classList.add("rotateIt");
  }

  // Update inputs state on errors
  function suggestionUIHandler(identifier, message) {
    if (identifier.lastElementChild.classList.contains("fieldSuggestion")) {
      identifier.lastChild.innerText = message;
    } else {
      identifier.insertAdjacentHTML(
        "beforeend",
        `<span class='fieldSuggestion'>${message}</span>`
      );
    }
  }
  // Clear Suggestions
  function clearSuggestionsHandler(...identifiers) {
    for (const key of identifiers) {
      const suggestion = key.parentElement.querySelector(".fieldSuggestion");
      suggestion && suggestion.remove();
    }
  }
  // Change inputs state back to default
  (function defaultUIHandler(...identifiers) {
    for (const key of identifiers) {
      key.addEventListener("input", function () {
        this.classList.remove("errorClass");
        form.classList.remove("rotateIt");
      });
    }
  })(username, email, password, confirmPassword);

  // Submiting Form
  submitBtn.addEventListener("click", function () {
    clearSuggestionsHandler(username, email, password, confirmPassword);
    evaluateAll() ? form.submit() : "";
  });

  username.addEventListener("input", function () {
    let msg = criteria.userName("");

    suggestionUIHandler(this.parentElement, msg);
  });

  email.addEventListener("input", function () {
    let msg = criteria.userEmail("");

    suggestionUIHandler(this.parentElement, msg);
  });

  password.addEventListener("input", function () {
    let msg = criteria.userPassword("");

    suggestionUIHandler(this.parentElement, msg);
  });

  confirmPassword.addEventListener("input", function () {
    let msg = criteria.userCPassword("");

    suggestionUIHandler(this.parentElement, msg);
  });
})();
