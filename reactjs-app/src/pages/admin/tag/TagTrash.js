import React, { useEffect, useState } from 'react';
import TagService from '../../../services/TagService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { urlImageTag } from '../../../config';
import { useNavigate } from 'react-router-dom';

const TagTrash = () => {
    const [tags, setTags] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrashedtags();
    }, [reload]);

    const fetchTrashedtags = async () => {
        try {
            const result = await TagService.getAll(); // Ensure this fetches trashed users
            setTags(result.filter(tag => tag.status === 2)); // Assuming status 2 is for trashed users
        } catch (error) {
            if (error.response && error.response.status === 503) {
                navigate('/admin/404');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    const restoreTag = async (id) => {
        try {
            await TagService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục.');
        }
    };

    const deleteTag = async (id) => {
        try {
            await TagService.delete(id);
            setReload(Date.now());
            toast.success('Xóa vĩnh viễn thành công');
        } catch (error) {
            console.error('Error deleting permanently:', error);
            toast.error('Đã xảy ra lỗi khi xóa vĩnh viễn.');
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Nhà xuất bản : Thùng rác</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/tag/index">Về danh sách</a>
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
                            <th>Tên nhà xuất bản</th>
                            <th>Biểu tượng</th>
                            <th>Mô tả</th>
                            <th>Ngày tạo</th>
                            <th>ID người tạo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tags && tags.map((tag, index) => (
                            <tr key={tag.id} className="datarow">
                                <td className="text-center">
                                    <input type="checkbox" id={`checkId${index}`} />
                                </td>
                                <td>
                                    <div className="name">
                                        <a href="menu_index.html">{tag.name}</a>
                                    </div>
                                    <div className="function_style">
                                        <button
                                            onClick={() => restoreTag(tag.id)}
                                            className="border-0 px-1 text-success"
                                        >
                                            <FaArrowAltCircleLeft />
                                        </button>
                                        <button
                                            onClick={() => deleteTag(tag.id)}
                                            className="btn-none px-1 text-danger"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                            {tag.image ? (
                                                <img src={urlImageTag + tag.image} className="img-fluid user-avatar" alt="Hinh anh" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>
                                        <td>{tag.description}</td>
                                        <td>{tag.createdAt}</td>
                                        <td>{tag.createdBy}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </section>
        </div>
    );
}

export default TagTrash;
