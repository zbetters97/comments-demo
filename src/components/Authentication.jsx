import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  disableNonNumericInput,
  formatPhoneNumber,
  isLoginValid,
  isSignupValid,
} from "../utils/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Authentication({ onClose }) {
  const { signup, usernameAvailable, login } = useAuthContext();

  // Signup or login
  const [isRegistration, setIsRegistration] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (onClose) {
      setIsRegistration(false);
      formRef.current.reset();
    }
  }, [onClose]);

  async function formAction(formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      if (isRegistration) {
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const phone = formData.get("phone");
        const username = formData.get("username");

        if (
          !isSignupValid(email, password, firstName, lastName, phone, username)
        ) {
          return;
        }

        if (!(await usernameAvailable(username))) {
          console.log("Username taken!");
          return;
        }

        if (
          await signup(email, password, firstName, lastName, phone, username)
        ) {
          setIsRegistration(false);
          onClose();
          formRef.current.reset();
        }
      } else {
        if (!isLoginValid(email, password)) {
          return;
        }

        if (await login(email, password)) {
          onClose();
          formRef.current.reset();
        }
      }
    } catch (error) {
      console.log(error);
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
        action={formAction}
      >
        {isRegistration && (
          <>
            <div className="flex justify-between gap-2">
              <label htmlFor="firstName">First Name</label>
              <input className="ml-auto" name="firstName" type="text" />
            </div>

            <div className="flex justify-between gap-2">
              <label htmlFor="lastName">Last Name</label>
              <input className="ml-auto" name="lastName" type="text" />
            </div>

            <div className="flex justify-between gap-2">
              <label htmlFor="username">Username</label>
              <input className="ml-auto" name="username" type="text" />
            </div>

            <div className="flex justify-between gap-2">
              <label htmlFor="phone">Phone Number</label>
              <input
                className="ml-auto"
                name="phone"
                type="tel"
                maxLength="16"
                onKeyDown={disableNonNumericInput}
                onKeyUp={formatPhoneNumber}
              />
            </div>
          </>
        )}

        <div className="flex justify-between gap-2">
          <label htmlFor="email">Email Address</label>
          <input className="ml-auto" name="email" type="text" />
        </div>

        <div className="flex justify-between gap-2">
          <label htmlFor="password">Password</label>
          <input className="ml-auto" name="password" type="password" />
        </div>

        <button
          className="m-auto self-start rounded-full bg-gray-900 px-3 py-1.5 text-white"
          type="submit"
        >
          Submit
        </button>
      </form>

      <button
        className="rounded-full px-3 py-1.5 hover:bg-gray-300"
        onClick={() => {
          formRef.current.reset();
          setIsRegistration(!isRegistration);
        }}
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
