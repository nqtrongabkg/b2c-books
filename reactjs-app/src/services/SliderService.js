import httpAxios from '../httpAxios';

const SliderService = {
    create: (brandData) => {
        return httpAxios.post(`config-services/api/sliders/create`, brandData);
    },
    setImage: (data) => {
        return httpAxios.put(`config-services/api/sliders/set-image`, data);
    },
    getById: (id) => {
        return httpAxios.get(`config-services/api/sliders/get-by-id/${id}`);
    },
    getAll: () => {
        return httpAxios.get(`config-services/api/sliders/get-all`);
    },
    update: (id, brand) => {
        return httpAxios.put(`config-services/api/sliders/update/${id}`, brand);
    },
    sitchStatus: (id) => {
        return httpAxios.put(`config-services/api/sliders/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`config-services/api/sliders/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`config-services/api/sliders/delete/${id}`);
    },
    display: (id) => {
        return httpAxios.put(`config-services/api/sliders/display/${id}`);
    },
};

export default SliderService;
