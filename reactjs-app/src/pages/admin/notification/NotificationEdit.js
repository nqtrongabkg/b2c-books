import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationService from '../../../services/NotificationService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const NotificationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [detail, setDetail] = useState("");
    const [statusOfSee, setStatusOfSee] = useState(0);
    const [linkTo, setLinkTo] = useState("");
    const [status, setStatus] = useState("");
    const [userId, setIserId] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await NotificationService.getById(id);
                setDescription(result.description);
                setDetail(result.detail);
                setStatusOfSee(result.statusOfSee);
                setLinkTo(result.linkTo);
                setStatus(result.status);
                setIserId(result.user.id)
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

        const updatedNotification = {
            user: {
                id: userId
            },
            description: description,
            detail: detail,
            statusOfSee: statusOfSee,
            linkTo: linkTo,
            status: status
        };

        try {
            const result = await NotificationService.update(id, updatedNotification);
            toast.success(result.message);
            navigate("/admin/notification/index", { replace: true });
        } catch (error) {
            console.error('Error updating notification:', error);
            toast.error("Đã xảy ra lỗi khi cập nhật thông báo.");
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Cập nhật thông báo</h1>
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
                                <select name="status" className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="0">Chưa xem</option>
                                    <option value="1">Đã xem</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content-header my-2">
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <button type="submit" className="btn btn-success btn-sm mr-2" name="CAPNHAT">
                                <FaSave /> Lưu [Cập nhật]
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
};

export default NotificationEdit;
