import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoleService from '../../../services/RoleService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const RoleEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const result = await RoleService.getById(id);
                setName(result.name);
                setDescription(result.description);
                setRole(result.role);
                setStatus(result.status)
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        })();
    }, [id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const updatedRole = {
            name: name,
            description: description,
            role: role
        };
        try {
            const result = await RoleService.update(id, updatedRole);
            toast.success(result.message);
            navigate("/admin/role/index", { replace: true });
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error("Đã xảy ra lỗi khi cập nhật vai trò.");
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Cập nhật vai trò</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" href="/admin/role/index" className="ml-2">
                                <FaSave /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Tên vai trò(*)</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Tên vai trò" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text" name="description" className="form-control" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Giá trị vai trò(*)</strong></label>
                                <input type="number" name="role" className="form-control" placeholder="Giá trị vai trò" value={role} onChange={e => setRole(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-select" onChange={(e) => { setStatus(e.target.value) }}
                                    value={status}>
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-header my-2">
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <button className="btn btn-success btn-sm" name="CAPNHAT">
                                <i className="fa fa-save"></i> Lưu [Cập nhật]
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
};

export default RoleEdit;
