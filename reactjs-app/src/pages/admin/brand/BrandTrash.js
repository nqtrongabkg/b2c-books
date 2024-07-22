import React, { useEffect, useState } from 'react';
import BrandService from '../../../services/BrandService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { urlImageBrand } from '../../../config';
import { useNavigate } from 'react-router-dom';

const BrandTrash = () => {
    const [brands, setBrands] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrashedUsers();
    }, [reload]);

    const fetchTrashedUsers = async () => {
        try {
            const result = await BrandService.getAll(); // Ensure this fetches trashed users
            setBrands(result.filter(brand => brand.status === 2)); // Assuming status 2 is for trashed users
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
            await BrandService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục.');
        }
    };

    const deleteUser = async (id) => {
        try {
            await BrandService.delete(id);
            setReload(Date.now());
            toast.success('Xóa vĩnh viễn thành công');
        } catch (error) {
            console.error('Error deleting user permanently:', error);
            toast.error('Đã xảy ra lỗi khi xóa vĩnh viễn.');
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Tác giả : Thùng rác</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/brand/index">Về danh sách</a>
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
                            <th>Tên tác giả</th>
                            <th>Ảnh</th>
                            <th>Mô tả</th>
                            <th>Ngày tạo</th>
                            <th>ID tạo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {brands && brands.map((brand, index) => (
                            <tr key={brand.id} className="datarow">
                                <td className="text-center">
                                    <input type="checkbox" id={`checkId${index}`} />
                                </td>
                                <td>
                                    <div className="name">
                                        <a href="menu_index.html">{brand.name}</a>
                                    </div>
                                    <div className="function_style">
                                        <button
                                            onClick={() => restoreUser(brand.id)}
                                            className="border-0 px-1 text-success"
                                        >
                                            <FaArrowAltCircleLeft />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(brand.id)}
                                            className="btn-none px-1 text-danger"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                            {brand.image ? (
                                                <img src={urlImageBrand + brand.image} className="img-fluid user-avatar" alt="Hinh anh" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>
                                        <td>{brand.description}</td>
                                        <td>{brand.createdAt}</td>
                                        <td>{brand.createdBy}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </section>
        </div>
    );
}

export default BrandTrash;
