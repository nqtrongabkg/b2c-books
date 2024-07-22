import httpAxios from '../httpAxios';

const ProductService = {
    create: (data) => {
        return httpAxios.post(`product-services/api/products/create`, data);
    },
    setImage: (data) => {
        return httpAxios.put(`product-services/api/products/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/products/get-by-id/${id}`);
    },
    getAllByUser: (id) => {
        return httpAxios.get(`product-services/api/products/find-all-by-user/${id}`);
    },
    getByUser: (id, page, size) => {
        return httpAxios.get(`product-services/api/products/get-by-user/${id}?page=${page}&size=${size}`);
    },    
    getByBrand: (id) => {
        return httpAxios.get(`product-services/api/products/get-by-brand/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/products/get-all`);
    },
    getPageSize: (page, size) => {
        return httpAxios.get(`product-services/api/products/get-product-page`, {
            params: {
                page: page,
                size: size
            }
        });
    }, 
    update: (id, data) => { 
        return httpAxios.put(`product-services/api/products/update/${id}`, data);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`product-services/api/products/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`product-services/api/products/trash/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`product-services/api/products/display/${id}`);
    },
    resetEvaluate: (id) => {
        return httpAxios.put(`product-services/api/products/update-evaluate/${id}`);
    },
    addQtyToCategory: (id) => {
        return httpAxios.put(`product-services/api/categories/add-product-qty/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/products/delete/${id}`);
    },
    search: (name) => {
        return httpAxios.get(`product-services/api/products/search/${name}`);
    },
}
export default ProductService;
