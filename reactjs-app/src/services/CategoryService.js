import httpAxios from '../httpAxios';

const CategoryService = {
    create: (data) => {
        return httpAxios.post(`product-services/api/categories/create`, data);
    },
    setImage: (data) => {
        return httpAxios.put(`product-services/api/categories/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/categories/get-by-id/${id}`);
    },
    getByUser: (userId) => {
        return httpAxios.get(`product-services/api/categories/get-by-user/${userId}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/categories/get-all`);
    },
    update: (id, data) => { 
        return httpAxios.put(`product-services/api/categories/update/${id}`, data);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`product-services/api/categories/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`product-services/api/categories/trash/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`product-services/api/categories/display/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/categories/delete/${id}`);
    },
    search: (name) => {
        return httpAxios.get(`product-services/api/categories/search/${name}`);
    },
}
export default CategoryService;
