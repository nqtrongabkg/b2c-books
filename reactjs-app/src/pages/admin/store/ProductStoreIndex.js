import React, { useEffect, useState } from 'react';
import ProductStoreService from '../../../services/ProductStoreService';
import ProductService from '../../../services/ProductService';
import ProductOptionService from '../../../services/ProductOptionService';
import { FaEdit, FaDollyFlatbed } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { urlImageProduct } from '../../../config';
import Pagination from '../../site/homeComponents/productComponents/Pagination';

const ProductStoreIndex = () => {
    const [stores, setStores] = useState([]);
    const [reload] = useState(0);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10; // Số sản phẩm mỗi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = stores.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        (async () => {
            try {
                const result = await ProductStoreService.getAll();
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setStores(result);
                setTotalPages(Math.ceil(result.length / itemsPerPage));
            }catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        })();
    }, [reload]);

    return (
        <div className="content">
            <section className="content-header my-2">
                <h1 className="d-inline">Quản lý kho hàng</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/product/import/index">Lịch sử nhập hàng</a>
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
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Đã bán</th>
                            <th>ID người dùng sở hữu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((store, index) => (
                            <ProductTableRow key={store.id} store={store} />
                        ))}
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </section>
        </div>
    );
};

const ProductTableRow = ({ store }) => {
    const [product, setProduct] = useState(null);
    const [optionValue, setOptionValue] = useState(null);
    const [option, setOption] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await ProductService.getById(store.productId);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        const fetchOptionValue = async () => {
            try {
                const fetched = await ProductOptionService.getOptionValue(store.optionValueId);

                if (fetched !== null) {
                    const option = await ProductOptionService.getById(fetched.optionId);
                    setOption(option);
                }
                setOptionValue(fetched);
            } catch (error) {
                console.error('Error fetching:', error);
            }
        };
        fetchOptionValue();
        fetchProduct();
    }, [store]);

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
                    <Link to={`/admin/product/store/edit/${store.id}`} className='px-1 text-primary'>
                        <FaEdit size={24}/>
                    </Link>
                    <Link to={`/admin/product/import/add/${store.id}`} className="px-1">
                        <FaDollyFlatbed size={24} />
                    </Link>
                </div>
            </td>
            <td>
                {product ? (
                    <img src={`${urlImageProduct}/${product.image}`} className="img-fluid user-avatar" alt="Hinh anh" />
                ) : (
                    <p>Không có ảnh</p>
                )}
            </td>
            <td>{option ? `${option.name} / ${optionValue ? optionValue.value : ''}` : 'Loading...'}</td>
            <td>{store.price}</td>
            <td>{store.quantity}</td>
            <td>{store.soldQuantity}</td>
            <td>{store.createdBy}</td>
        </tr>
    );
};

export default ProductStoreIndex;
