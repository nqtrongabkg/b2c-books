import httpAxios from '../httpAxios';

const FeedbackService = {

    create: (brandData) => {
        return httpAxios.post(`product-services/api/product-feedbacks/create`, brandData);
    },
    setImage: (data) => {
        return httpAxios.put(`product-services/api/product-feedbacks/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/product-feedbacks/get-by-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/product-feedbacks/get-all`);
    },
    update: (id, brand) => { 
        return httpAxios.put(`product-services/api/product-feedbacks/update/${id}`, brand);
    },
    getByProductId: (id) => {
        return httpAxios.get(`product-services/api/product-feedbacks/get-by-product-id/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`product-services/api/product-feedbacks/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/product-feedbacks/delete/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`product-services/api/product-feedbacks/display/${id}`);
    },
};

export default FeedbackService;
