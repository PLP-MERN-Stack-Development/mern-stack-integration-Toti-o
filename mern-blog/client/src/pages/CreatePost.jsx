import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState(1);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/posts", { title, content, author, categoryId });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
      <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
        <option value={1}>Technology</option>
        <option value={2}>Lifestyle</option>
        <option value={3}>Travel</option>
      </select>
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;
