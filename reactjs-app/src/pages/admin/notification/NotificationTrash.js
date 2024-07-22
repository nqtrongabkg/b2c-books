import React, { useEffect, useState } from 'react';
import NotificationService from '../../../services/NotificationService';
import { FaTrash, FaArrowAltCircleLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NotificationTrash = () => {
    const [notifications, setNotifications] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrashedNotifications();
    }, [reload]);

    const fetchTrashedNotifications = async () => {
        try {
            const result = await NotificationService.getAll();
            setNotifications(result.filter(notification => notification.status === 2)); // Filter trashed notifications
        } catch (error) {
            if (error.response && error.response.status === 503) {
                navigate('/admin/404');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    const restoreNotification = async (id) => {
        try {
            await NotificationService.switchStatus(id); // Restore notification by switching status
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring notification:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục thông báo.');
        }
    };

    const deleteNotificationPermanently = async (id) => {
        try {
            const result = await NotificationService.delete(id); // Permanently delete notification
            if (result) {
                setReload(Date.now());
                toast.success('Xóa thành công');
            }
        } catch (error) {
            console.error('Error deleting notification permanently:', error);
            toast.error('Đã xảy ra lỗi khi xóa thông báo.');
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Thùng rác thông báo</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/notification/index">Về danh sách</a>
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
                        {notifications && notifications.length > 0 &&
                            notifications.map((notification, index) => {
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
                                                    onClick={() => restoreNotification(notification.id)}
                                                    className="border-0 px-1 text-success">
                                                    <FaArrowAltCircleLeft />
                                                </button>
                                                <button
                                                    onClick={() => deleteNotificationPermanently(notification.id)}
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
                            })
                        }
                    </tbody>
                </table>

            </section>
        </div>
    );
};

export default NotificationTrash;
