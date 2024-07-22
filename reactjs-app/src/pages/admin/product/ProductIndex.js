import React, { useEffect, useState } from 'react';
import ProductService from '../../../services/ProductService';
import BrandService from '../../../services/BrandService';
import { FaToggleOn, FaTrash, FaEdit, FaToggleOff, FaTag, FaHandLizard } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageProduct } from '../../../config';
import { MdOutlineCollections } from "react-icons/md";
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const ProductIndex = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(0);
    const [brandNames, setBrandNames] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let response = await ProductService.getPageSize(currentPage - 1, itemsPerPage);
                setProducts(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchProducts();
    }, [currentPage, itemsPerPage, navigate, reload]);

    useEffect(() => {
        const fetchBrandNames = async () => {
            const names = {};
            for (const product of products) {
                try {
                    if (product.brandId !== null) {
                        const brand = await BrandService.getById(product.brandId);
                        names[product.brandId] = brand !== null ? brand.name : "N/A";
                    } else {
                        names[product.brandId] = "N/A";
                    }
                } catch (error) {
                    console.error("Error fetching brand:", error);
                    names[product.brandId] = "N/A";
                }
            }
            setBrandNames(names);
        };
        fetchBrandNames();
    }, [products]);

    const handleTrash = async (id) => {
        await ProductService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await ProductService.sitchStatus(id);
            setReload(Date.now());
            toast.success("Thành công");
        } catch (error) {
            console.error('Error switching status:', error);
            toast.error("Đã xảy ra lỗi khi thay đổi trạng thái.");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Quản lý sản phẩm</h1>
                <Link to="/admin/product/add" className="btn-add">Thêm mới</Link>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/product/trash">Thùng rác</a>
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
                            <th>Tên</th>
                            <th>Thương hiệu</th>
                            <th>Ảnh</th>
                            <th>Mô tả</th>
                            <th>Đánh giá</th>
                            <th>Ngày tạo</th>
                            <th>ID người tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.length > 0 &&
                            products.map((product, index) => {
                                return (
                                    <tr key={product.id} className="datarow">
                                        <td className="text-center">
                                            <input type="checkbox" id={`checkId${index}`} />
                                        </td>
                                        <td>
                                            <div className="name">
                                                <a href="menu_index.html">
                                                    {product.name}
                                                </a>
                                            </div>
                                            <div className="function_style">
                                                <button
                                                    onClick={() => handleStatus(product.id, product.status)}
                                                    className={
                                                        product.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"
                                                    }>
                                                    {product.status === 1 ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                                </button>
                                                <Link to={"/admin/product/edit/" + product.id} className='px-1 text-primary'>
                                                    <FaEdit size={23} />
                                                </Link>
                                                <Link to={'/admin/product/sale-add/' + product.id} className="px-1 text-info">
                                                    <FaTag size={23} />
                                                </Link>
                                                <Link to={'/admin/product/option-add/' + product.id} className="px-1">
                                                    <FaHandLizard size={24} />
                                                </Link>
                                                <Link to={'/admin/product/gallary-index/' + product.id} className="px-1">
                                                    <MdOutlineCollections size={24} />
                                                </Link>
                                                <button
                                                    onClick={() => handleTrash(product.id)}
                                                    className="btn-none px-1 text-danger">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                        <td>{brandNames[product.brandId]}</td>
                                        <td>
                                            {product.image ? (
                                                <img src={urlImageProduct + product.image} className="img-fluid user-avatar" alt="Hinh anh" />
                                            ) : (
                                                <p>Không có ảnh</p>
                                            )}
                                        </td>
                                        <td>{product.description}</td>
                                        <td>{product.evaluate}</td>
                                        <td>{product.createdAt}</td>
                                        <td>{product.createdBy}</td>
                                    </tr>
                                );
                            })
                        }
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

export default ProductIndex;