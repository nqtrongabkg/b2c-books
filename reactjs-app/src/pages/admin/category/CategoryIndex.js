import React, { useEffect, useState } from 'react';
import CategoryService from '../../../services/CategoryService';
import { FaToggleOn, FaTrash, FaEdit, FaToggleOff } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageCategory } from '../../../config';
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const CategoryIndex = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [reload, setReload] = useState(0);
    const itemsPerPage = 10; // Số lượng loại sản phẩm mỗi trang
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                let result = await CategoryService.getAll();
                result = result.filter(category => category.status !== 2);
                const sortedCategories = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPages(Math.ceil(sortedCategories.length / itemsPerPage));
                setCategories(sortedCategories);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchCategories();
    }, [reload]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    const HandTrash = async (id) => {
        await CategoryService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };
    const handleDislay = async (id) => {
        await CategoryService.display(id);
        setReload(Date.now());
        toast.success("Đã chuyển đổi trưng bày");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await CategoryService.switchStatus(id);
            setReload(Date.now());
            toast.success("Thành công");
        } catch (error) {
            console.error('Error switching status:', error);
            toast.error("Đã xảy ra lỗi khi thay đổi trạng thái.");
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Quản lý loại sản phẩm</h1>
                <Link to="/admin/category/add" className="btn-add">Thêm mới</Link>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/category/trash">Thùng rác</a>
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
                            <th>Tên loại</th>
                            <th>Biểu tượng</th>
                            <th>Mô tả</th>
                            <th>Số lượng sản phẩm</th>
                            <th>Ngày tạo</th>
                            <th>ID người tạo</th>
                            <th>Trưng bày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((category, index) => {
                            return (
                                <tr key={category.id} className="datarow">
                                    <td className="text-center">
                                        <input type="checkbox" id={`checkId${index}`} />
                                    </td>
                                    <td>
                                        <div className="name">
                                            <a href="menu_index.html">
                                                {category.name}
                                            </a>
                                        </div>
                                        <div className="function_style">
                                            <button
                                                onClick={() => handleStatus(category.id, category.status)}
                                                className={
                                                    category.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                }>
                                                {category.status === 1 ? <FaToggleOn size={24}/> : <FaToggleOff size={24}/>}
                                            </button>
                                            <Link to={"/admin/category/edit/" + category.id} className='px-1 text-primary'>
                                                <FaEdit size={20}/>
                                            </Link>
                                            <button
                                                onClick={() => HandTrash(category.id)}
                                                className="btn-none px-1 text-danger">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {category.image ? (
                                            <img src={urlImageCategory + category.image} className="img-fluid user-avatar" alt="Hinh anh" />
                                        ) : (
                                            <p>Không có ảnh</p>
                                        )}
                                    </td>
                                    <td>{category.description}</td>
                                    <td>{category.productQuantity}</td>
                                    <td>{category.createdAt}</td>
                                    <td>{category.createdBy}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDislay(category.id)}
                                            className={
                                                category.status === 3 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                            }>
                                            {category.status === 3 ? <FaToggleOn size={24}/> : <FaToggleOff size={24}/>}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </section>
        </div>
    );
};

export default CategoryIndex;
