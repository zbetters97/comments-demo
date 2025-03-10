import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { disableNonNumericInput, formatPhoneNumber, isLoginValid, isSignupValid } from "../utils/form";

export default function Authentication({ handleCloseModal }) {

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
        handleCloseModal();
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
    <div>
      <h2>{isRegistration ? "Create an account" : "Login to your account"}</h2>

      <form onSubmit={submitAuthentication}>

        {isRegistration && (
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              name="firstName"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />

            <label htmlFor="lastName">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              name="phone"
              type="tel"
              maxLength="16"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              onKeyDown={disableNonNumericInput}
              onKeyUp={formatPhoneNumber}
            />
          </div>)
        }

        <label htmlFor="email">Email Address</label>
        <input
          name="email"
          type="text"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          Submit
        </button>
      </form>

      <button onClick={() => { setIsRegistration(!isRegistration) }}>
        <p>{isRegistration ? "Sign In" : "Sign Up"}</p>
      </button>
    </div>
  );
}