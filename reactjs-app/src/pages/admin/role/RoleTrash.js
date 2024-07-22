import React, { useEffect, useState } from 'react';
import RoleService from '../../../services/RoleService';
import { FaTrash, FaArrowAltCircleLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RoleTrash = () => {
    const [roles, setRoles] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrashedRoles();
    }, [reload]);

    const fetchTrashedRoles = async () => {
        try {
            const result = await RoleService.getAll();
            setRoles(result.filter(role => role.status === 2)); // Filter trashed roles
        } catch (error) {
            if (error.response && error.response.status === 503) {
                navigate('/admin/404');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    const restoreRole = async (id) => {
        try {
            await RoleService.sitchStatus(id); // Restore role by switching status
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring role:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục quyền.');
        }
    };

    const deleteRolePermanently = async (id) => {
        try {
            const result = await RoleService.delete(id); // Permanently delete role
            if (result) {
                setReload(Date.now());
                toast.success('Xóa thành công');
            }
        } catch (error) {
            console.error('Error deleting role permanently:', error);
            toast.error('Đã xảy ra lỗi khi xóa quyền.');
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Phân Quyền</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/role/index">Về danh sách</a>
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
                            <th>Tên quyền</th>
                            <th>Mô tả</th>
                            <th>Giá trị quyền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles && roles.length > 0 &&
                            roles.map((role, index) => {
                                if (role.status !== 1 && role.status !== 0) {
                                    return (
                                        <tr key={role.id} className="datarow">
                                            <td className="text-center">
                                                <input type="checkbox" id="checkId" />
                                            </td>
                                            <td>
                                                <div className="name">
                                                    <a href="menu_index.html">
                                                        {role.name}
                                                    </a>
                                                </div>
                                                <div className="function_style">
                                                    <button
                                                        onClick={() => restoreRole(role.id)}
                                                        className="border-0 px-1 text-success">
                                                        <FaArrowAltCircleLeft />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRolePermanently(role.id)}
                                                        className="btn-none px-1 text-danger">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>{role.description}</td>
                                            <td>{role.role}</td>
                                        </tr>
                                    );
                                }
                                // Add a return statement for the case where the condition isn't met
                                return null;
                            })
                        }
                    </tbody>
                </table>

            </section>
        </div>
    );
};

export default RoleTrash;
