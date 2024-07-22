import React, { useEffect, useState } from 'react';
import ProductSaleService from '../../../services/ProductSaleService';
import ProductService from '../../../services/ProductService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { urlImageProduct } from '../../../config';
import { LocalDateTime, DateTimeFormatter } from 'js-joda';

const ProductSaleTrash = () => {
    const [sales, setSales] = useState([]);
    const [reload, setReload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const result = await ProductSaleService.getAll();
                // Filter out sales with status 2
                const filteredSales = result.filter(sale => sale.status === 2);
                // Sort the filtered sales array by createdAt property from newest to oldest
                filteredSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setSales(filteredSales);
            }catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
            
        })();
    }, [reload]);

    const restoreSale = async (id) => {
        try {
            await ProductSaleService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục người dùng.');
        }
    };

    const deleteSale = async (id) => {
        try {
            await ProductSaleService.delete(id);
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
                <h1 className="d-inline">Giảm giá : Thùng rác</h1>
                
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/product/sale-index">Về danh sách</a>
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
                            <th>Giá giảm</th>
                            <th>Số lượng</th>
                            <th>Mô tả</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales && sales.length > 0 &&
                            sales.map((sale, index) => (
                                <ProductSaleTableRow key={sale.id} sale={sale} restoreSale={restoreSale} deleteSale={deleteSale} />
                            ))
                        }
                    </tbody>
                </table>
            </section>
        </div>
    );
};

const ProductSaleTableRow = ({ sale, restoreSale, deleteSale }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await ProductService.getById(sale.productId);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [sale.productId]);

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
                        <Link to={`/admin/product/${product.id}`}>{product.name}</Link>
                    ) : (
                        <span>Loading...</span>
                    )}
                </div>
                <div className="function_style">
                    <button
                        onClick={() => restoreSale(sale.id)}
                        className="border-0 px-1 text-success"
                    >
                        <FaArrowAltCircleLeft />
                    </button>
                    <button
                        onClick={() => deleteSale(sale.id)}
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
            <td>{sale.priceSale}</td>
            <td>{sale.quantity}</td>
            <td>{sale.description}</td>
            <td>{formatDate(sale.dateBegin)}</td>
            <td>{formatDate(sale.dateEnd)}</td>
        </tr>
    );
};

export default ProductSaleTrash;
