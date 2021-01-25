$(document).ready(() => {
  // Getting references to our form and inputs
  const resetPasswordForm = $("form.resetpassword");
  const passwordInput = $("input#password-input");
  const userEmail = $("#user-email").text();

  // When the form is submitted, we validate there's an email and password entered
  resetPasswordForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      password: passwordInput.val().trim(),
      email: userEmail
    };

    if (!userData.password || !userData.email) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    resetPassword(userData.password, userData.email);
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function resetPassword(password, email) {
    $.post("/api/passreset", {
      email: email,
      password: password
    })
      .then(() => {
        window.location.replace("/");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  }
});
