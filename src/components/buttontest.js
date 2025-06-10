import { useState } from "react";

function MyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(""); // Add this line

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAge: ${age}\nGender: ${gender}`);
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
      <br />
      <label>Select your gender:
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">--Please choose--</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not">Prefer not to say</option>
        </select>
      </label>
      <input type="submit" />
    </form>
  )
}

export default MyForm;