import api from "./api";

// ✅ Generate captions for a product
export const generateCaptions = async (productData) => {
  // productData should be an object: { productName, productDescription }
  const res = await api.post("/generate-captions", productData);
  return res.data; // assuming backend returns { captions: [...] }
};
