import { useState } from "react";
import Head from "next/head";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailinfo = {
      name,
      email,
      text,
    };
    fetch('/api/orderemail', {
      method: 'post',
      body: JSON.stringify(emailinfo),
    });
 
    // handle form submission here
  };

  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="text">Message:</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
