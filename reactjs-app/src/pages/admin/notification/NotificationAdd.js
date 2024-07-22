import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationService from '../../../services/NotificationService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const NotificationAdd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [detail, setDetail] = useState("");
    const [statusOfSee] = useState(0);
    const [linkTo, setLinkTo] = useState("");
    const [status, setStatus] = useState(1); // Mặc định giá trị của status là 1

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            user: {
                id: id
            },
            description: description,
            detail: detail,
            statusOfSee: statusOfSee,
            linkTo: linkTo,
            status: status
        };

        try {
            const result = await NotificationService.create(formData);
            console.log("added notification", result);
            toast.success("Thêm thông báo thành công!");
            navigate("/admin/notification/index", { replace: true });
        } catch (error) {
            console.error('Error creating notification:', error);
            toast.error("Đã xảy ra lỗi khi thêm thông báo.");
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Thêm thông báo</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" href="/admin/notification/index" className="ml-2">
                                <FaSave /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text" name="description" className="form-control" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Chi tiết</strong></label>
                                <input type="text" name="detail" className="form-control" placeholder="Chi tiết" value={detail} onChange={e => setDetail(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Link đến</strong></label>
                                <input type="text" name="linkTo" className="form-control" placeholder="Link đến" value={linkTo} onChange={e => setLinkTo(e.target.value)} />
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

export default NotificationAdd;
