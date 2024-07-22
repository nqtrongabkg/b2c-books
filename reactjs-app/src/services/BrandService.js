import httpAxios from '../httpAxios';

const BrandService = {
    create: (brandData) => {
        return httpAxios.post(`product-services/api/brands/create`, brandData);
    },
    setImage: (data) => {
        return httpAxios.put(`product-services/api/brands/set-image`, data);
    },
    
    getById: (id) => {
        return httpAxios.get(`product-services/api/brands/get-by-id/${id}`);
    },
    getByUserId: (userId) => {
        return httpAxios.get(`product-services/api/brands/get-by-user/${userId}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/brands/get-all`);
    },
    update: (id, brand) => { 
        return httpAxios.put(`product-services/api/brands/update/${id}`, brand);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`product-services/api/brands/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`product-services/api/brands/trash/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`product-services/api/brands/display/${id}`);
    },
    setPublic: (id) => {
        return httpAxios.put(`product-services/api/brands/public/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/brands/delete/${id}`);
    },
    search: (name) => {
        return httpAxios.get(`product-services/api/brands/search/${name}`);
    },
}
export default BrandService;
