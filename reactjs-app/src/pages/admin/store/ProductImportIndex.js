import React, { useEffect, useState } from 'react';
import ProductStoreService from '../../../services/ProductStoreService';
import ProductService from '../../../services/ProductService';
import ProductOptionService from '../../../services/ProductOptionService';
import { FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { urlImageProduct } from '../../../config';

const ProductImportIndex = () => {
    const [imports, setImports] = useState([]);
    const [reload] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const result = await ProductStoreService.getImports();
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setImports(result);
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
                <h1 className="d-inline">Quản lý nhập hàng</h1>
                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/product/store/index">Về kho hàng</a>
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
                            <th>Giá nhập</th>
                            <th>Số lượng nhập</th>
                            <th>Mô tả</th>
                            <th>ID User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {imports && imports.length > 0 &&
                            imports.map((importItem, index) => (
                                <ProductTableRow key={index} importItem={importItem} />
                            ))
                        }
                    </tbody>
                </table>
            </section>
        </div>
    );
};

const ProductTableRow = ({ importItem }) => {
    const [store, setStore] = useState(null);
    const [product, setProduct] = useState(null);
    const [optionValue, setOptionValue] = useState(null);
    const [option, setOption] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log("import item: ", importItem);
                const fetchedStore = await ProductStoreService.getById(importItem.storeId);
                // console.log("store: ", fetchedStore);
                setStore(fetchedStore);

                // Fetch product only if store is fetched successfully
                if (fetchedStore) {
                    const fetchedProduct = await ProductService.getById(fetchedStore.productId);
                    setProduct(fetchedProduct);
                }

                // Fetch option value only if store is fetched successfully
                if (fetchedStore && fetchedStore.optionValueId !== null) {
                    const fetchedOptionValue = await ProductOptionService.getOptionValue(fetchedStore.optionValueId);
                    setOptionValue(fetchedOptionValue);

                    if (fetchedOptionValue) {
                        const fetchedOption = await ProductOptionService.getById(fetchedOptionValue.optionId);
                        setOption(fetchedOption);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [importItem]);

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
                    <Link to={store && `/admin/product/import/edit/${importItem.id}`} className='px-1 text-primary'>
                        <FaEdit size={24}/>
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
            <td>{importItem && importItem.price}</td>
            <td>{importItem && importItem.quantity}</td>
            <td>{importItem && importItem.description}</td>
            <td>{importItem && importItem.createdBy}</td>
        </tr>
    );
};


export default ProductImportIndex;
