import { useState } from "react";

function SimpleForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData); // callback to parent
    setFormData({ name: "", text: "", image: null }); // reset
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-md max-w-md mx-auto"
    >
      <label className="flex flex-col text-gray-700">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
      </label>

      <label className="flex flex-col text-gray-700">
        Text:
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
          className="border rounded p-2"
          rows="4"
        />
      </label>

      <label className="flex flex-col text-gray-700">
        Image:
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border rounded p-2"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}

export default SimpleForm;