import React, { useEffect, useState } from 'react';
import InformationService from '../../../services/InformationService';
import UserService from '../../../services/UserService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { urlImageInformation } from '../../../config';

const InformationTrash = () => {
    const [informations, SetInformations] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrashedUsers();
    }, [reload]);

    const fetchTrashedUsers = async () => {
        try {
            const result = await InformationService.getAll(); // Ensure this fetches trashed users
            SetInformations(result.filter(info => info.status === 2)); // Assuming status 2 is for trashed users
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
            await InformationService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục người dùng.');
        }
    };

    const deleteUser = async (id) => {
        try {
            const result = await InformationService.delete(id);
            console.log("image: ", result.logo);
            if(result.avatar){
                const deleteImage = {
                    path: "informations",
                    filename: result.image
                };
                await UserService.deleteImage(deleteImage)
            }
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
                <h1 className="d-inline">Thông tin cấu hình : Thùng rác</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/information/index">Về danh sách</a>
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
                            <th>Tên</th>
                            <th>Ảnh</th>
                            <th>Địa chỉ</th>
                            <th>Email</th>
                            <th>Điện thoại</th>
                            <th>Mã số doanh nghiệp</th>
                            <th>Giấy phép</th>
                            <th>Người đại diện</th>
                            <th>Số điện thoại người đại diện</th>
                            <th>Ngày tạo</th>
                            <th>Trưng bày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {informations && informations.length > 0 &&
                            informations.map((information, index) => {
                                return (
                                    <tr key={information.id} className="datarow">
                                        <td className="text-center">
                                            <input type="checkbox" id={`checkId${index}`} />
                                        </td>
                                        <td>
                                            <div className="name">
                                                <a href="menu_index.html">
                                                    {information.name}
                                                </a>
                                            </div>
                                            <div className="function_style">
                                        <button
                                            onClick={() => restoreUser(information.id)}
                                            className="border-0 px-1 text-success"
                                        >
                                            <FaArrowAltCircleLeft />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(information.id)}
                                            className="btn-none px-1 text-danger"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                        </td>
                                        <td>
                                            {information.logo ? (
                                                <img src={urlImageInformation + information.logo} className="img-fluid user-avatar" alt="HinhAnh" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>
                                        <td>{information.address}</td>
                                        <td>{information.email}</td>
                                        <td>{information.phone}</td>
                                        <td>{information.businessNumber}</td>
                                        <td>{information.license}</td>
                                        <td>{information.repersent}</td>
                                        <td>{information.repersentPhone}</td>
                                        <td>{information.createdAt}</td>
                                        
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default InformationTrash;
