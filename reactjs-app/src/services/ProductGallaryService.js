import httpAxios from '../httpAxios';

const ProductGallaryService = {
    create: (data) => {
        return httpAxios.post(`product-services/api/product-galleries/create`, data);
    },
    setImage: (data) => {
        return httpAxios.put(`product-services/api/product-galleries/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/product-galleries/get-by-id/${id}`);
    },
    getByProductId: (id) => {
        return httpAxios.get(`product-services/api/product-galleries/get-by-product-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/product-galleries/get-all`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/product-galleries/delete/${id}`);
    },
    deleteByProductId: (productId) => {
        return httpAxios.delete(`product-services/api/product-galleries/delete-by-product-id/${productId}`);
    },
}
export default ProductGallaryService;
