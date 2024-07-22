import React, { useEffect, useState } from 'react';
import BrandService from '../../../services/BrandService';
import { FaToggleOn, FaTrash, FaEdit, FaToggleOff } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageBrand } from '../../../config';
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const BrandIndex = () => {
    const [brands, setBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [reload, setReload] = useState(0);
    const itemsPerPage = 10; // Số lượng thương hiệu mỗi trang
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                let result = await BrandService.getAll();
                result = result.filter(brand => brand.status !== 2);
                const sortedBrands = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setTotalPages(Math.ceil(sortedBrands.length / itemsPerPage));
                setBrands(sortedBrands);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchBrands();
    }, [reload]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = brands.slice(indexOfFirstItem, indexOfLastItem);

    const HandTrash = async (id) => {
        await BrandService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };

    const handleDislay = async (id) => {
        await BrandService.display(id);
        setReload(Date.now());
        toast.success("Đã chuyển đổi trưng bày");
    };

    const handlePublic = async (id) => {
        await BrandService.setPublic(id);
        setReload(Date.now());
        toast.success("Đã chuyển đổi trưng bày");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await BrandService.switchStatus(id);
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
                <h1 className="d-inline">Quản lý tác giả</h1>
                <Link to="/admin/brand/add" className="btn-add">Thêm mới</Link>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/brand/trash">Thùng rác</a>
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
                            <th>Tên tác giả</th>
                            <th>Ảnh</th>
                            <th>Mô tả</th>
                            <th>Ngày tạo</th>
                            <th>ID tạo</th>
                            <th>Trưng bày</th>
                            <th>Công cộng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((brand, index) => {
                            return (
                                <tr key={brand.id} className="datarow">
                                    <td className="text-center">
                                        <input type="checkbox" id={`checkId${index}`} />
                                    </td>
                                    <td>
                                        <div className="name">
                                            <a href="menu_index.html">
                                                {brand.name}
                                            </a>
                                        </div>
                                        <div className="function_style">
                                            <button
                                                onClick={() => handleStatus(brand.id, brand.status)}
                                                className={
                                                    brand.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                }>
                                                {brand.status === 1 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                            </button>
                                            <Link to={"/admin/brand/edit/" + brand.id} className='px-1 text-primary'>
                                                <FaEdit size={20} />
                                            </Link>
                                            <button
                                                onClick={() => HandTrash(brand.id)}
                                                className="btn-none px-1 text-danger">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {brand.image ? (
                                            <img src={urlImageBrand + brand.image} className="img-fluid user-avatar" alt="Hinh anh" />
                                        ) : (
                                            <p>Không có ảnh</p>
                                        )}
                                    </td>
                                    <td>{brand.description}</td>
                                    <td>{brand.createdAt}</td>
                                    <td>{brand.createdBy}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDislay(brand.id)}
                                            className={
                                                brand.status === 3 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                            }>
                                            {brand.status === 3 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handlePublic(brand.id)}
                                            className={
                                                brand.status === 4 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                            }>
                                            {brand.status === 4 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
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

export default BrandIndex;
