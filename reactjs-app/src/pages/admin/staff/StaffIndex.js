import React, { useEffect, useState } from 'react';
import UserService from '../../../services/UserService';
import { FaToggleOn, FaTrash, FaEdit, FaToggleOff } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageUser } from '../../../config';
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const StaffIndex = () => {
    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10; // Số thành viên trên mỗi trang
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let result = await UserService.getStaffs();
                // Filter out users with status 2 and admin user
                result = result.filter(user => user.status !== 2 && user.userName !== "admin");
                // Sort users by createdAt in descending order
                const sortedUsers = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUsers(sortedUsers);
                setTotalPages(Math.ceil(sortedUsers.length / usersPerPage));
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchUsers();
    }, [reload]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const HandTrash = async (id) => {
        await UserService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await UserService.sitchStatus(id);
            setReload(Date.now());
            toast.success("Thành công");
        } catch (error) {
            console.error('Error switching status:', error);
            toast.error("Đã xảy ra lỗi khi thay đổi trạng thái.");
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Danh sách thành viên</h1>
                <Link to="/admin/staff/add" className="btn-add">Thêm mới</Link>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/staff/trash">Thùng rác</a>
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
                            <th>Quyền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers && currentUsers.length > 0 &&
                            currentUsers.map((user, index) => {
                                return (
                                    <tr key={user.id} className="datarow">
                                        <td className="text-center">
                                            <input type="checkbox" id={`checkId${index}`} />
                                        </td>
                                        <td>
                                            <div className="name">
                                                <a href="menu_index.html">
                                                    {user.userName}
                                                </a>
                                            </div>
                                            <div className="function_style">
                                                <button
                                                    onClick={() => handleStatus(user.id, user.status)}
                                                    className={
                                                        user.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                    }>
                                                    {user.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                                                </button>
                                                <Link to={"/admin/staff/edit/" + user.id} className='px-1 text-primary'>
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => HandTrash(user.id)}
                                                    className="btn-none px-1 text-danger">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                        <td>{user.name}</td>
                                        <td>
                                            {user.avatar ? (
                                                <img src={urlImageUser + user.avatar} className="img-fluid user-avatar" alt="User" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>

                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.address}</td>
                                        <td>Quản trị</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </section>
        </div>
    );
};

export default StaffIndex;
