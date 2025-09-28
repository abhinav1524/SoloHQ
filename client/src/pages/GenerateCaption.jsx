import { useState } from "react";
import {generateCaptions}  from "../services/generateCaptionsService";

const GenerateCaption = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCaptions([]);

    try {
      const data = await generateCaptions({ productName, productDescription });
      setCaptions(data.captions || []);
    } catch (err) {
      setError(err.message || "Failed to generate captions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen flex justify-center items-center">
    <div className="w-full max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">AI Caption Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Product Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Captions"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {captions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Captions:</h2>
          <ul className="list-disc list-inside space-y-1">
            {captions.map((caption, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded">{caption}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default GenerateCaption;
