import instance from "."

export const createOrder = async (inventionId, order) => {
    const response = await instance.post(`/orders/${inventionId}`, order);
    return response.data;
}

export const getOrders = async () => {
    const response = await instance.get("/orders");
    return response.data;
}
export const getOrder = async (id) => {
    const response = await instance.get(`/orders/${id}`);
    return response.data;
}

export const updateOrder = async (id, order) => {
    const response = await instance.put(`/orders/${id}`, order);
    return response.data;
}

export const deleteOrder = async (id) => {
    const response = await instance.delete(`/orders/${id}`);
    return response.data;
}
