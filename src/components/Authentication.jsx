import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { disableNonNumericInput, formatPhoneNumber, isLoginValid, isSignupValid } from "../utils/form";

export default function Authentication({ onClose }) {

  const { signup, login } = useAuthContext();

  // Signup or login
  const [isRegistration, setIsRegistration] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  async function submitAuthentication(event) {

    event.preventDefault();

    try {
      if (isRegistration) {
        if (!isSignupValid(email, password, firstName, lastName, phone)) {
          return;
        }

        await signup(email, password, firstName, lastName, phone);
        setIsRegistration(false);
      }
      else {
        if (!isLoginValid(email, password)) {
          return;
        }

        await login(email, password);
        onClose();
      }

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
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
        className="flex flex-col gap-5 [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&_input]:border-1"
        onSubmit={submitAuthentication}
      >

        {isRegistration && (
          <>
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                className="border-1 border-black"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                name="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="phone">Phone #</label>
              <input
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

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            name="email"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
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
        onClick={() => { setIsRegistration(!isRegistration) }}
      >
        <p>{isRegistration ? "Sign In" : "Sign Up"}</p>
      </button>
    </div>
  );
}