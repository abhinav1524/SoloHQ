import api from "./api";

export const getSales = async () => {
  const res = await api.get("/sales/");
//   console.log(res)
  return res.data;
};