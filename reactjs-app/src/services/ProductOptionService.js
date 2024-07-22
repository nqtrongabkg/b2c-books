import httpAxios from '../httpAxios';

const ProductOptionService = {
    create: (data) => {
        return httpAxios.post(`product-services/api/options/create`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/options/get-by-id/${id}`);
    },
    getByUser: (id) => {
        return httpAxios.get(`product-services/api/options/get-by-user/${id}`);
    },
    getOptionValue: (id) => {
        return httpAxios.get(`product-services/api/option-values/get-by-id/${id}`);
    },
    getByProduct: (id) => {
        return httpAxios.get(`product-services/api/options/get-by-product-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/options/get-all`);
    },
    update: (id, data) => { 
        return httpAxios.put(`product-services/api/options/update/${id}`, data);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`product-services/api/options/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`product-services/api/options/trash/${id}`);
    },
    
    delete: (id) => {
        return httpAxios.delete(`product-services/api/options/delete/${id}`);
    },
}
export default ProductOptionService;
