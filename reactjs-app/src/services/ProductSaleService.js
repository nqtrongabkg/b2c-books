import httpAxios from '../httpAxios';

const ProductSaleService = {
    create: (data) => {
        return httpAxios.post(`product-services/api/product-sales/create`, data);
    },
    getById: (id) => {
        return httpAxios.get(`product-services/api/product-sales/get-by-id/${id}`);
    },
    getByProduct: (id) => {
        return httpAxios.get(`product-services/api/product-sales/get-by-product-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`product-services/api/product-sales/get-all`);
    },
    getByUser: (id) => {
        return httpAxios.get(`product-services/api/product-sales/get-by-user/${id}`);
    },
    update: (id, data) => { 
        return httpAxios.put(`product-services/api/product-sales/update/${id}`, data);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`product-services/api/product-sales/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`product-services/api/product-sales/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`product-services/api/product-sales/delete/${id}`);
    },
    exportSale: (id, quantity) => {
        return httpAxios.put(`product-services/api/product-sales/export-sale/${id}/${quantity}`);
    },
    
}
export default ProductSaleService;
