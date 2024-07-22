import React, { useEffect, useState } from 'react';
import ProductOptionService from '../../../services/ProductOptionService';
import ProductService from '../../../services/ProductService';
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageProduct } from '../../../config';
import { LocalDateTime, DateTimeFormatter } from 'js-joda';
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const ProductOptionIndex = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [optionsPerPage] = useState(10); // Số lượng lựa chọn trên mỗi trang
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const result = await ProductOptionService.getAll();
                // Filter out options with status 2
                const filteredOptions = result.filter(option => option.status !== 2);
                // Sort the filtered options array by createdAt property from newest to oldest
                filteredOptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOptions(filteredOptions);
            }catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchOptions();
    }, [reload]);

    // Lấy index của lựa chọn đầu tiên trên trang hiện tại
    const indexOfLastOption = currentPage * optionsPerPage;
    const indexOfFirstOption = indexOfLastOption - optionsPerPage;
    const currentOptions = options.slice(indexOfFirstOption, indexOfLastOption);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const HandTrash = async (id) => {
        await ProductOptionService.trash(id);
        setReload(Date.now());
        toast.success("Chuyển vào thùng rác");
    };

    const handleStatus = async (id, currentStatus) => {
        try {
            await ProductOptionService.switchStatus(id);
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
                <h1 className="d-inline">Sản phẩm | Lựa chọn của sản phẩm</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/product/option-trash">Thùng rác</a>
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
                            <th>Tên sản phẩm</th>
                            <th>Ảnh</th>
                            <th>Tên lựa chọn</th>
                            <th>Mô tả</th>
                            <th>Các lựa chọn</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOptions && currentOptions.length > 0 &&
                            currentOptions.map((option, index) => (
                                <ProductOptionTableRow key={option.id} option={option} HandTrash={HandTrash} handleStatus={handleStatus} />
                            ))
                        }
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(options.length / optionsPerPage)}
                    onPageChange={paginate}
                />
            </section>
        </div>
    );
};

const ProductOptionTableRow = ({ option, HandTrash, handleStatus }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await ProductService.getById(option.productId);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [option.productId]);

    const formatDate = (date) => {
        const dateTime = LocalDateTime.parse(date);
        const formatter = DateTimeFormatter.ofPattern("dd/MM/yy");
        return dateTime.format(formatter);
    };

    return (
        <tr className="datarow">
            <td className="text-center">
                <input type="checkbox" id="checkId" />
            </td>
            <td>
                <div className="name">
                    {product ? (
                        <Link to={`#nqt`}>{product.name}</Link>
                    ) : (
                        <span>Loading...</span>
                    )}
                </div>
                <div className="function_style">
                    <button
                        onClick={() => handleStatus(option.id, option.status)}
                        className={option.status === 1 ? "border-0 px-1 text-success" : "border-0 px-1 text-danger"}>
                        {option.status === 1 ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <Link to={`/admin/product/option-edit/${option.id}`} className='px-1 text-primary'>
                        <FaEdit />
                    </Link>
                    <button
                        onClick={() => HandTrash(option.id)}
                        className="btn-none px-1 text-danger">
                        <FaTrash />
                    </button>
                </div>
            </td>
            <td>
                {product ? (
                    <img src={`${urlImageProduct}/${product.image}`} className="img-fluid user-avatar" alt="Hinh anh" />
                ) : (
                    <p>Không có ảnh</p>
                )}
            </td>
            <td>{option.name}</td>
            <td>{option.description}</td>
            <td>
                <ul>
                    {option.values && option.values.length > 0 && option.values.map((value, index) => (
                        <li key={index}>{value.value}</li>
                    ))}
                </ul>
            </td>
            <td>{formatDate(option.createdAt)}</td>
        </tr>
    );
};

export default ProductOptionIndex;
