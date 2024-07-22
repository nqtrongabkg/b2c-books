import httpAxios from '../httpAxios';

const OrderService = {

    create: (brandData) => {
        return httpAxios.post(`order-services/api/orders/create`, brandData);
    },
    getById: (id) => {
        return httpAxios.get(`order-services/api/orders/get-by-id/${id}`);
    },
    getByUser: (id) => {
        return httpAxios.get(`order-services/api/orders/get-by-user/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`order-services/api/orders/get-all`);
    },
    update: (id, brand) => { 
        return httpAxios.put(`order-services/api/orders/update/${id}`, brand);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`order-services/api/orders/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`order-services/api/orders/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`order-services/api/orders/delete/${id}`);
    },
    getCart: (id) => {
        return httpAxios.get(`order-services/api/orders/get-cart/${id}`);
    },
    payVNPAY: (amount) => {
        return httpAxios.get(`order-services/api/order-pay/pay?amount=${amount}`);
    },
    setPay: (id, pay) => {
        return httpAxios.post(`order-services/api/orders/set-payment/${id}`, null, { params: { pay } });
    },
};

export default OrderService;
