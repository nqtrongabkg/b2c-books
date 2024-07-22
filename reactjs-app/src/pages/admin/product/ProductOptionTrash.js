import React, { useEffect, useState } from 'react';
import ProductOptionService from '../../../services/ProductOptionService';
import ProductStoreService from '../../../services/ProductStoreService';
import ProductService from '../../../services/ProductService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageProduct } from '../../../config';
import { LocalDateTime, DateTimeFormatter } from 'js-joda';

const ProductOptionTrash = () => {
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        (async () => {
            try{
                const result = await ProductOptionService.getAll();
                // Filter out sales with status 2
                const filtered = result.filter(sale => sale.status === 2);
                // Sort the filtered sales array by createdAt property from newest to oldest
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOptions(filtered);
            }catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        })();
    }, [reload]);

    const restoreOption = async (id) => {
        try {
            await ProductOptionService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục người dùng.');
        }
    };

    const deleteOption = async (id) => {
        try {
            const result = await ProductOptionService.delete(id);
            console.log("deleted option: ", result);
            result.values.forEach(async (value) => {
                try {
                    await ProductStoreService.deleteByOptionValue(value.id);
                    console.log("Deleted ProductStore with option value id: ", value.id);
                } catch (error) {
                    console.error("Error deleting ProductStore:", error);
                }
            });
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
                <h1 className="d-inline">Lựa chọn sản phẩm : Thùng rác</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/product/option-index">Về danh sách</a>
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
                        {options && options.length > 0 &&
                            options.map((option, index) => (
                                <ProductSaleTableRow key={option.id} option={option} restoreOption={restoreOption} deleteOption={deleteOption} />
                            ))
                        }
                    </tbody>
                </table>
            </section>
        </div>
    );
};

const ProductSaleTableRow = ({ option, restoreOption, deleteOption}) => {
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
                        onClick={() => restoreOption(option.id)}
                        className="border-0 px-1 text-success"
                    >
                        <FaArrowAltCircleLeft />
                    </button>
                    <button
                        onClick={() => deleteOption(option.id)}
                        className="btn-none px-1 text-danger"
                    >
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

export default ProductOptionTrash;
