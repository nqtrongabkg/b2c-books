import httpAxios from '../httpAxios';

const ProductCategoryService = {
    create: (data) => {
        return httpAxios.post(`product-services/api/product-categories/create`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/product-categories/get-by-id/${id}`);
    },
    getByProductId: (id) => {
        return httpAxios.get(`product-services/api/product-categories/get-by-product-id/${id}`);
    },
    getByCategoryId: (id) => {
        return httpAxios.get(`product-services/api/product-categories/get-by-category-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/product-categories/get-all`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/product-categories/delete/${id}`);
    },
    deleteByProductId: (productId) => {
        return httpAxios.delete(`product-services/api/product-categories/delete-by-product-id/${productId}`);
    },
}
export default ProductCategoryService;
