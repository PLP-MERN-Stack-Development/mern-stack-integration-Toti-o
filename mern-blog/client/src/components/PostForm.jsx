import { useState, useEffect } from "react";
import axios from "axios";

const PostForm = ({ post, onSuccess }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [category, setCategory] = useState(post?.category?._id || "");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, content, category };
    try {
      if (post) {
        await axios.put(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/posts`, payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full"/>
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="border p-2 w-full"/>
      <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 w-full">
        <option value="">Select Category</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">{post ? "Update" : "Create"}</button>
    </form>
  );
};

export default PostForm;
