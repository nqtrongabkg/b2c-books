import React, { useEffect, useState } from 'react';
import UserService from '../../../services/UserService';
import ProductService from '../../../services/ProductService';
import BrandService from '../../../services/BrandService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { urlImageUser } from '../../../config';

const UserTrash = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        fetchTrashedUsers();
    }, [reload]);

    const fetchTrashedUsers = async () => {
        try {
            const result = await UserService.getCustomer(); // Ensure this fetches trashed users
            setUsers(result.filter(user => user.status === 2)); // Assuming status 2 is for trashed users
        } catch (error) {
            if (error.response && error.response.status === 503) {
                navigate('/admin/404');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    const restoreUser = async (id) => {
        try {
            // Lấy tất cả các sản phẩm của người dùng
            const products = await ProductService.getAllByUser(id);
            const brands = await BrandService.getByUserId(id);
    
            // Khôi phục từng sản phẩm
            for (const product of products) {
                await ProductService.sitchStatus(product.id);
            }

            for (const brand of brands){
                await BrandService.sitchStatus(brand.id);
            }
    
            // Khôi phục người dùng
            await UserService.sitchStatus(id);
    
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user or products:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục người dùng hoặc sản phẩm.');
        }
    };    

    const deleteUser = async (id) => {
        try {
            const result = await UserService.delete(id);
            console.log("image: ", result.avatar);
            if(result.avatar){
                const deleteImage = {
                    path: "users",
                    filename: result.avatar
                };
                await UserService.deleteImage(deleteImage)
            }
            setReload(Date.now());
            toast.success('Xóa vĩnh viễn thành công');
        } catch (error) {
            console.error('Error deleting user permanently:', error);
            toast.error('Đã xảy ra lỗi khi xóa vĩnh viễn người dùng.');
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Người dùng : Thùng rác</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/user/index">Về danh sách</a>
                        </button>
                    </div>
                </div>
            </section>
            <section className="content-body my-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '30px' }}>
                                <input type="checkbox" id="checkAll" />
                            </th>
                            <th>Tên đăng nhập</th>
                            <th>Tên người dùng</th>
                            <th>Ảnh đại diện</th>
                            <th>Email</th>
                            <th>Điện thoại</th>
                            <th>Địa chỉ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users && users.map((user, index) => (
                            <tr key={user.id} className="datarow">
                                <td className="text-center">
                                    <input type="checkbox" id={`checkId${index}`} />
                                </td>
                                <td>
                                    <div className="name">
                                        <a href="menu_index.html">{user.userName}</a>
                                    </div>
                                    <div className="function_style">
                                        <button
                                            onClick={() => restoreUser(user.id)}
                                            className="border-0 px-1 text-success"
                                        >
                                            <FaArrowAltCircleLeft />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="btn-none px-1 text-danger"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                                <td>{user.name}</td>
                                <td><img src={urlImageUser + user.avatar} className="img-fluid user-avatar" alt="User" /></td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </section>
        </div>
    );
}

export default UserTrash;
