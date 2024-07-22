import httpAxios from '../httpAxios';

const OrderItemService = {

    create: (brandData) => {
        return httpAxios.post(`order-services/api/order-items/create`, brandData);
    },
    getById: (id) => {
        return httpAxios.get(`order-services/api/order-items/get-by-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`order-services/api/order-items/get-all`);
    },
    getByOrder: (id) => {
        return httpAxios.get(`order-services/api/order-items/get-by-order/${id}`);
    },
    update: (id, brand) => { 
        return httpAxios.put(`order-services/api/order-items/update/${id}`, brand);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`order-services/api/order-items/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`order-services/api/order-items/trash/${id}`);
    },
    export: (id) => {
        return httpAxios.put(`order-services/api/order-items/export/${id}`);
    },
    complete: (id) => {
        return httpAxios.put(`order-services/api/order-items/complete/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`order-services/api/order-items/delete/${id}`);
    }
};

export default OrderItemService;
