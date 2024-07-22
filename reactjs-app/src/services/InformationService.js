import httpAxios from '../httpAxios';

const InformationService = {

    create: (brandData) => {
        return httpAxios.post(`config-services/api/informations/create`, brandData);
    },
    setImage: (data) => {
        return httpAxios.put(`config-services/api/informations/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`config-services/api/informations/get-by-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`config-services/api/informations/get-all`);
    },
    getDisplay: () => {
        return httpAxios.get(`config-services/api/informations/get-display`);
    },
    update: (id, brand) => { 
        return httpAxios.put(`config-services/api/informations/update/${id}`, brand);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`config-services/api/informations/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`config-services/api/informations/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`config-services/api/informations/delete/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`config-services/api/informations/display/${id}`);
    },
};

export default InformationService;
