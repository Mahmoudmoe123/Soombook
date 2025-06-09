import { useState } from "react";

function MyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAge: ${age}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your name:
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>Enter your email:
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label>Enter your phone:
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <br />
      <label>Enter your age:
        <input 
          type="number" 
          value={age}
          min="0"
          max="120"
          onChange={(e) => setAge(e.target.value)}
        />
      </label>
      <input type="submit" />
    </form>
  )
}

export default MyForm;