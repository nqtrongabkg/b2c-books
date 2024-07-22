import React, { useEffect, useState } from 'react';
import InformationService from '../../../services/InformationService';
import { FaToggleOn, FaTrash, FaEdit, FaToggleOff } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageInformation } from '../../../config';

const InformationIndex = () => {
    const [informations, SetInformations] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result = await InformationService.getAll();
                // Filter out users with status 2
                result = result.filter(inf => inf.status !== 2);
                // Sort users by createdAt in descending order
                const sortedData = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                SetInformations(sortedData);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [reload]);

    const HandTrash = async (id) => {
        await InformationService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await InformationService.sitchStatus(id);
            setReload(Date.now());
            toast.success("Thành công");
        } catch (error) {
            console.error('Error switching status:', error);
            toast.error("Đã xảy ra lỗi khi thay đổi trạng thái.");
        }
    };

    const handleDislay = async (id) => {
        await InformationService.display(id);
        setReload(Date.now());
        toast.success("Đã chuyển đổi trưng bày");
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Thông tin cấu hình</h1>
                <Link to="/admin/information/add" className="btn-add">Thêm mới</Link>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/information/trash">Thùng rác</a>
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
                            {/* <th>Ngày tạo</th> */}
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
                                                    onClick={() => handleStatus(information.id, information.status)}
                                                    className={
                                                        information.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                    }>
                                                    {information.status === 1 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                                </button>
                                                <Link to={"/admin/information/edit/" + information.id} className='px-1 text-primary'>
                                                    <FaEdit size={20} />
                                                </Link>
                                                <button
                                                    onClick={() => HandTrash(information.id)}
                                                    className="btn-none px-1 text-danger">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {information.logo ? (
                                                <img src={urlImageInformation + information.logo} className="img-fluid user-avatar" alt="HinhAnh" style={{ width: '250px', height: '50px' }} />
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
                                        {/* <td>{information.createdAt}</td> */}
                                        <td>
                                            <button
                                                onClick={() => handleDislay(information.id)}
                                                className={
                                                    information.status === 3 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                }>
                                                {information.status === 3 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default InformationIndex;
