import React, { useEffect, useState } from 'react';
import ProductStoreService from '../../../services/ProductStoreService';
import ProductService from '../../../services/ProductService';
import { Link, useNavigate } from 'react-router-dom';
import { urlImageProduct } from '../../../config';
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const ProductExportIndex = () => {
    const [exports, setExports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [exportsPerPage] = useState(10); // Số lượng xuất hàng trên mỗi trang
    const [reload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExports = async () => {
            try {
                const result = await ProductStoreService.getExports();
                if(result){
                    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setExports(result);
                }
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchExports();
    }, [reload]);

    // Lấy index của sản phẩm đầu tiên trên trang hiện tại
    const indexOfLastExport = currentPage * exportsPerPage;
    const indexOfFirstExport = indexOfLastExport - exportsPerPage;
    const currentExports = exports.slice(indexOfFirstExport, indexOfLastExport);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Quản lý lịch sử xuất hàng</h1>
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
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Ngày xuất</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentExports && currentExports.length > 0 &&
                            currentExports.map((exportItem, index) => (
                                <ProductExportTableRow key={exportItem.id} exportItem={exportItem} />
                            ))
                        }
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(exports.length / exportsPerPage)}
                    onPageChange={paginate}
                />
            </section>
        </div>
    );
};

const ProductExportTableRow = ({ exportItem }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await ProductService.getById(exportItem.productId);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };

        fetchProduct();
    }, [exportItem]);

    function formatDateToLocalDate(datetimeString) {
        const date = new Date(datetimeString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

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
                    {/* <Link to={`/admin/product/export/detail/${exportItem.id}`} className='px-1 text-primary'>
                        <FaEye size={24} />
                    </Link> */}
                </div>
            </td>
            <td>
                {product ? (
                    <img src={`${urlImageProduct}/${product.image}`} className="img-fluid user-avatar" alt="Hinh anh" />
                ) : (
                    <p>Không có ảnh</p>
                )}
            </td>
            <td>{exportItem.price}</td>
            <td>{exportItem.quantity}</td>
            <td>{formatDateToLocalDate(exportItem.createdAt)}</td>
        </tr>
    );
};

export default ProductExportIndex;
