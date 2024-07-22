import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleService from '../../../services/RoleService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const RoleAdd = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [role, setRole] = useState(""); 
    const [status, setStatus] = useState(1);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isNaN(parseInt(role))) {
            toast.error("Vui lòng nhập một số nguyên cho quyền.");
            return;
        }
        
        const formData = {
            name: name,
            description: description,
            role: parseInt(role),
            status: status
        };

        (async () => {
            try {
                console.log("role data add , ", formData);
                const result = await RoleService.create(formData);
                console.log("added role ", result);
                toast.success("Thêm quyền thành công!");
                navigate("/admin/role/index", { replace: true });
            } catch (error) {
                console.error('Error creating role:', error);
                toast.error("Đã xảy ra lỗi khi thêm quyền.");
            }
        })();
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Thêm quyền</h1>
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
                                <label><strong>Tên quyền(*)</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Tên quyền" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text" name="description" className="form-control" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Quyền (*)</strong></label>
                                <input type="number" name="role" className="form-control" placeholder="Nhập quyền" value={role} onChange={e => setRole(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value={1}>Hoạt động</option>
                                    <option value={0}>Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-header my-2">
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <button type="submit" className="btn btn-success btn-sm mr-2" name="THEM">
                                <i className="fa fa-save"></i> Lưu [Thêm]
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}

export default RoleAdd;
