export function disableNonNumericInput(e) {
  if (e.ctrlKey) return;
  if (e.key.length > 1) return;
  if (/[0-9.]/.test(e.key)) return;

  e.preventDefault();
}

export function formatPhoneNumber(e) {
  const digits = e.target.value.replace(/\D/g, "").substring(0, 10);

  const areaCode = digits.substring(0, 3);
  const prefix = digits.substring(3, 6);
  const suffix = digits.substring(6, 10);

  if (digits.length > 6) {
    e.target.value = `(${areaCode}) ${prefix} - ${suffix}`;
  } else if (digits.length > 3) {
    e.target.value = `(${areaCode}) ${prefix}`;
  } else if (digits.length > 0) {
    e.target.value = `(${areaCode}`;
  }
}

function isEmailValid(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function isPasswordValid(password) {
  return password.length >= 8;
}

export function isSignupValid(email, password, firstName, lastName, phone) {
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !phone ||
    !isEmailValid(email) ||
    !isPasswordValid(password)
  ) {
    console.log("Check input fields!");
    return false;
  } else {
    return true;
  }
}

export function isLoginValid(email, password) {
  if (
    !email ||
    !password ||
    !isEmailValid(email) ||
    !isPasswordValid(password)
  ) {
    console.log("Check input fields!");
    return false;
  } else {
    return true;
  }
}
