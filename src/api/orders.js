import instance from "."

export const createOrder = async (inventionId, order) => {
    const { data } = await instance.post(`/orders/${inventionId}`, order);
    return data;
}

export const getOrders = async () => {
    const { data } = await instance.get("/orders");
    return data;
}

export const getOrder = async (id) => {
    const { data } = await instance.get(`/orders/${id}`);
    return data;
}

export const updateOrder = async (id, order) => {
    const { data } = await instance.put(`/orders/${id}`, order);
    return data;
}

export const deleteOrder = async (id) => {
    const { data } = await instance.delete(`/orders/${id}`);
    return data;
}
