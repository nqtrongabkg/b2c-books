import httpAxios from '../httpAxios';

const FavoriteService = {
    create: (data) => {
        return httpAxios.post(`order-services/api/favorites/create`, data);
    },
    getById: (id) => {
        return httpAxios.get(`order-services/api/favorites/get-by-id/${id}`);
    },
    getByUser: (id) => {
        return httpAxios.get(`order-services/api/favorites/get-by-user/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`order-services/api/favorites/get-all`);
    },
    delete: (id) => {
        return httpAxios.delete(`order-services/api/favorites/delete/${id}`);
    },
}
export default FavoriteService;
