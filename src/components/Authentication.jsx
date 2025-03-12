import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { disableNonNumericInput, formatPhoneNumber, isLoginValid, isSignupValid } from "../utils/form";

export default function Authentication({ onClose }) {

  const { signup, usernameAvailable, login } = useAuthContext();

  // Signup or login
  const [isRegistration, setIsRegistration] = useState(false);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  function resetFields() {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setUsername("");
  }

  async function submitAuthentication(event) {

    event.preventDefault();

    try {
      if (isRegistration) {

        if (!isSignupValid(email, password, firstName, lastName, phone, username)) {
          return;
        }

        if (!await usernameAvailable(username)) {
          console.log("Username taken!");
          return;
        }

        if (await signup(email, password, firstName, lastName, phone, username)) {
          setIsRegistration(false);
          onClose();
          resetFields();
        }
      }
      else {
        if (!isLoginValid(email, password)) {
          return;
        }

        if (await login(email, password)) {
          onClose();
          resetFields();
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="text-2xl flex flex-col justify-evenly items-center gap-10">

      <h2 className="font-bold">
        {isRegistration ? "Create an account" : "Login to your account"}
      </h2>

      <form
        className="flex flex-col gap-5 [&_input]:border-1"
        onSubmit={submitAuthentication}
      >

        {isRegistration && (
          <>
            <div className="flex justify-between gap-2">
              <label htmlFor="firstName">First Name</label>
              <input
                className="ml-auto"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            <div className="flex justify-between gap-2">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="ml-auto"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>

            <div className="flex justify-between gap-2">
              <label htmlFor="username">Username</label>
              <input
                className="ml-auto"
                name="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div className="flex justify-between gap-2">
              <label htmlFor="phone">Phone Number</label>
              <input
                className="ml-auto"
                name="phone"
                type="tel"
                maxLength="16"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                onKeyDown={disableNonNumericInput}
                onKeyUp={formatPhoneNumber}
              />
            </div>
          </>)
        }

        <div className="flex justify-between gap-2">
          <label htmlFor="email">Email Address</label>
          <input
            className="ml-auto"
            name="email"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="flex justify-between gap-2">
          <label htmlFor="password">Password</label>
          <input
            className="ml-auto"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button
          className="self-start m-auto text-white bg-gray-900 rounded-full py-1.5 px-3 "
          type="submit"
        >
          Submit
        </button>
      </form>

      <button
        className="py-1.5 px-3 rounded-full hover:bg-gray-300"
        onClick={() => {
          resetFields();
          setIsRegistration(!isRegistration)
        }}
      >
        {isRegistration ?
          <p>Sign in <i className="fa-solid fa-arrow-right" /></p> :
          <p><i className="fa-solid fa-arrow-left" /> Sign up</p>
        }
      </button>
    </div>
  );
}