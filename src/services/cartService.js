import axios from "../api/axios";

export const viewCart = async () => {
  const response = await axios.get("/api/private/cart");
  return response.data;
};

export const addToCart = async (productId, quantity) => {
  const response = await axios.post(
    `/api/private/cart/add/${productId}`,
    null,
    {
      params: { quantity },
    }
  );
  return response.data;
};

export const updateProductQuantity = async (cartId, productId, quantity) => {
  const response = await axios.put("/api/private/cart/update-quantity", {
    cartId,
    productId,
    quantity,
  });
  return response.data;
};

export const deleteCartItem = async (cartId, productId) => {
  const response = await axios.delete(
    `/api/private/cart/remove/${cartId}/${productId}`
  );
  return response.data;
};
