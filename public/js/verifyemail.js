$(document).ready(() => {
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const emailInput = $("input#email-input");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim()
    };
    console.log(userData);

    if (!userData.email) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    sendEmail(userData.email);
    emailInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function sendEmail(email) {
    $.post("/api/sendResetEmail", {
      email: email
    }).catch(err => {
      console.log(err);
    });
  }
});
