import httpAxios from '../httpAxios';

const BannerService = {

    create: (brandData) => {
        return httpAxios.post(`config-services/api/banners/create`, brandData);
    },
    setImage: (data) => {
        return httpAxios.put(`config-services/api/banners/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`config-services/api/banners/get-by-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`config-services/api/banners/get-all`);
    },
    getDisplay: () => {
        return httpAxios.get(`config-services/api/banners/get-display`);
    },
    update: (id, brand) => { 
        return httpAxios.put(`config-services/api/banners/update/${id}`, brand);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`config-services/api/banners/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`config-services/api/banners/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`config-services/api/banners/delete/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`config-services/api/banners/display/${id}`);
    },
};

export default BannerService;
