import React, { useEffect, useState } from 'react';
import NotificationService from '../../../services/NotificationService';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const NotificationIndex = () => {
    const [notifications, setNotifications] = useState([]);
    const [reload, setReload] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const notificationsPerPage = 10; // Số thông báo trên mỗi trang
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const result = await NotificationService.getAll();
                setNotifications(result);
                setTotalPages(Math.ceil(result.length / notificationsPerPage));
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchNotifications();
    }, [reload]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const HandTrash = async (id) => {
        await NotificationService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await NotificationService.switchStatus(id);
            setReload(Date.now());
            toast.success("Thành công");
        } catch (error) {
            console.error('Error switching status:', error);
            toast.error("Đã xảy ra lỗi khi thay đổi trạng thái.");
        }
    };

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Thông báo</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/notification/trash">Thùng rác</a>
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
                            <th>Tài khoản</th>
                            <th>Mô tả</th>
                            <th>Chi tiết</th>
                            <th>Tình trạng</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentNotifications && currentNotifications.length > 0 &&
                            currentNotifications.map((notification, index) => {
                                // Chỉ hiển thị notification có status khác 2
                                if (notification.status !== 2) {
                                    return (
                                        <tr key={notification.id} className="datarow">
                                            <td className="text-center">
                                                <input type="checkbox" id="checkId" />
                                            </td>
                                            <td>
                                                <div className="name">
                                                    <a href="menu_index.html">
                                                        {notification.user.name}
                                                    </a>
                                                </div>
                                                <div className="function_style">
                                                    <button
                                                        onClick={() => handleStatus(notification.id, notification.status)}
                                                        className={
                                                            notification.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                        }>
                                                        {notification.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                                                    </button>
                                                    <Link to={"/admin/notification/edit/" + notification.id} className='px-1 text-primary'>
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => HandTrash(notification.id)}
                                                        className="btn-none px-1 text-danger">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>{notification.description}</td>
                                            <td>{notification.detail}</td>
                                            <td>{notification.statusOfSee === 0 ? "Chưa xem" : "Đã xem"}</td>
                                            <td>{notification.createdAt}</td>
                                        </tr>
                                    );
                                }
                                // Add a return statement for the case where the condition isn't met
                                return null;
                            })
                        }
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </section>
        </div>
    );
};

export default NotificationIndex;
