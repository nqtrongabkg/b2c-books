import React, { useEffect, useState } from 'react';
import SliderService from '../../../services/SliderService';
import UserService from '../../../services/UserService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { urlImageSlider } from '../../../config';

const SliderTrash = () => {
    const [sliders, setSliders] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrashedUsers();
    }, [reload]);

    const fetchTrashedUsers = async () => {
        try {
            const result = await SliderService.getAll(); // Ensure this fetches trashed users
            setSliders(result.filter(slider => slider.status === 2)); // Assuming status 2 is for trashed users
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
            await SliderService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục người dùng.');
        }
    };

    const deleteUser = async (id) => {
        try {
            const result = await SliderService.delete(id);
            console.log("image: ", result.avatar);
            if(result.avatar){
                const deleteImage = {
                    path: "sliders",
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
                <h1 className="d-inline">Slider : Thùng rác</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/slider/index">Về danh sách</a>
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
                            <th>Mô tả</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sliders && sliders.map((slider, index) => (
                            <tr key={slider.id} className="datarow">
                                <td className="text-center">
                                    <input type="checkbox" id={`checkId${index}`} />
                                </td>
                                <td>
                                    <div className="name">
                                        <a href="menu_index.html">{slider.name}</a>
                                    </div>
                                    <div className="function_style">
                                        <button
                                            onClick={() => restoreUser(slider.id)}
                                            className="border-0 px-1 text-success"
                                        >
                                            <FaArrowAltCircleLeft />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(slider.id)}
                                            className="btn-none px-1 text-danger"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                            {slider.image ? (
                                                <img src={urlImageSlider + slider.image} className="img-fluid user-avatar" alt="HinhAnh" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>
                                        <td>{slider.description}</td>
                                        <td>{slider.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </section>
        </div>
    );
}

export default SliderTrash;
