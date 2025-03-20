import { useAuthContext } from "../context/Auth/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
  disableNonNumericInput,
  formatPhoneNumber,
  isLoginValid,
  isSignupValid,
} from "../utils/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AuthInput from "../components/Inputs/AuthInput";

export default function Authentication({ onClose }) {
  const { signup, usernameAvailable, login } = useAuthContext();
  const [isRegistration, setIsRegistration] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (onClose) {
      resetForm();
    }
  }, [onClose]);

  function resetForm() {
    setIsRegistration(false);
    formRef.current?.reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      if (isRegistration) {
        await handleSignup(formData, email, password);
      } else {
        await handleLogin(email, password);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSignup(formData, email, password) {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phone = formData.get("phone");
    const username = formData.get("username");

    if (isSignupValid(email, password, firstName, lastName, phone)) {
      console.log("Invalid signup information! Please review.");
      return;
    }
    if (!(await usernameAvailable(username))) {
      console.log("Username taken!");
      return;
    }

    if (await signup(email, password, firstName, lastName, phone, username)) {
      resetForm();
      onClose();
    }
  }

  async function handleLogin(email, password) {
    if (!isLoginValid(email, password)) {
      console.log("Invalid login credentials!");
      return;
    }

    if (await login(email, password)) {
      resetForm();
      onClose();
    }
  }

  return (
    <div className="flex flex-col items-center justify-evenly gap-10 text-2xl">
      <h2 className="font-bold">
        {isRegistration ? "Create an account" : "Login to your account"}
      </h2>

      <form
        className="flex flex-col gap-5 [&_input]:border-1"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        {isRegistration && (
          <>
            <AuthInput label="First Name" name="firstName" type="text" />
            <AuthInput label="Last Name" name="lastName" type="text" />
            <AuthInput label="Username" name="username" type="text" />
            <AuthInput
              label="Phone Number"
              name="phone"
              type="tel"
              maxLength="16"
              onKeyDown={disableNonNumericInput}
              onKeyUp={formatPhoneNumber}
            />
          </>
        )}

        <AuthInput label="Email Address" name="email" type="text" />
        <AuthInput label="Password" name="password" type="password" />

        <button
          className="m-auto self-start rounded-full bg-gray-900 px-3 py-1.5 text-white"
          type="submit"
        >
          Submit
        </button>
      </form>

      <button
        className="rounded-full px-3 py-1.5 hover:bg-gray-300"
        onClick={resetForm}
      >
        {isRegistration ? (
          <p className="flex items-center gap-1">
            Sign in
            <FontAwesomeIcon icon={faArrowRight} />
          </p>
        ) : (
          <p className="flex items-center gap-1">
            <FontAwesomeIcon icon={faArrowLeft} />
            Sign up
          </p>
        )}
      </button>
    </div>
  );
}
