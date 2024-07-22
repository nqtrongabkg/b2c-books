import httpAxios from '../httpAxios';

const TagService = {
    create: (brandData) => {
        return httpAxios.post(`product-services/api/tags/create`, brandData);
    },
    setImage: (data) => {
        return httpAxios.put(`product-services/api/tags/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/tags/get-by-id/${id}`);
    },
    getByUser: (userId) => {
        return httpAxios.get(`product-services/api/tags/get-by-user/${userId}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/tags/get-all`);
    },
    update: (id, brand) => { 
        return httpAxios.put(`product-services/api/tags/update/${id}`, brand);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`product-services/api/tags/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`product-services/api/tags/trash/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`product-services/api/tags/display/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/tags/delete/${id}`);
    },
}
export default TagService;
