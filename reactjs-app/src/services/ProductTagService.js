import httpAxios from '../httpAxios';

const ProductTagService = {
    create: (data) => {
        return httpAxios.post(`product-services/api/product-tags/create`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/product-tags/get-by-id/${id}`);
    },
    getByProductId: (id) => {
        return httpAxios.get(`product-services/api/product-tags/get-by-product-id/${id}`);
    },
    getByTagId: (id) => {
        return httpAxios.get(`product-services/api/product-tags/get-by-tag-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/product-tags/get-all`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/product-tags/delete/${id}`);
    },
    deleteByProductId: (productId) => {
        return httpAxios.delete(`product-services/api/product-tags/delete-by-product-id/${productId}`);
    },
}
export default ProductTagService;
