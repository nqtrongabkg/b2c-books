import httpAxios from '../httpAxios';

const RoleService = {
    create: (role) => {
        return httpAxios.post(`user-services/api/roles/create`, role);
    },
    getById: (id) => {
        return httpAxios.get(`user-services/api/roles/get-by-id/${id}`);
    },
    getByRole: (role) => {
        return httpAxios.get(`user-services/api/roles/get-by-role/${role}`);
    },
    getAll: () => {
        return httpAxios.get(`user-services/api/roles/get-all`);
    },
    update: (id, role) => {
        return httpAxios.put(`user-services/api/roles/update/${id}`, role);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`user-services/api/roles/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`user-services/api/roles/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`user-services/api/roles/delete/${id}`);
    },
};

export default RoleService;
