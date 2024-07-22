import httpAxios from '../httpAxios';

const UserService = {
    create: (user) => {
        return httpAxios.post(`user-services/api/users/create-user`, user);
    },
    setImage: (data) => {
        return httpAxios.put(`user-services/api/users/set-image`, data);
    },
    saveImage: (id, path, image) => {
        const formData = new FormData();
        formData.append('path', new Blob([JSON.stringify(path)], {
            type: "application/json"
        }));
        formData.append('image', image);
        return httpAxios.post(`user-services/api/users/save-image/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
    },
    deleteImage: (data) => {
        return httpAxios.delete(`user-services/api/users/delete-image`, { data: data });
    },
    
    login: (user) => {
        return httpAxios.post(`user-services/api/users/token`, user);
    },
    loginAdmin: (user) => {
        return httpAxios.post(`user-services/api/users/token`, user);
    },
    getUserById: (id) => {
        return httpAxios.get(`user-services/api/users/get-by-id/${id}`);
    },
    getCustomer: () => {
        return httpAxios.get(`user-services/api/users/get-customers`);
    },
    getStaffs: () => {
        return httpAxios.get(`user-services/api/users/get-staffs`);
    },
    
    sitchStatus: (id) => {
        return httpAxios.put(`user-services/api/users/switch-status/${id}`);
    },
    trash: (id) => {
        return httpAxios.put(`user-services/api/users/trash/${id}`);
    },
    delete: (id) => {
        return httpAxios.delete(`user-services/api/users/delete/${id}`);
    },
    update: (id, user) => {
        return httpAxios.put(`user-services/api/users/update/${id}`, user);
    },
    updateToStore: (id) => {
        return httpAxios.put(`user-services/api/users/update-to-store/${id}`);
    },
    
}
export default UserService;
