import React, { useEffect, useState } from 'react';
import ProductService from '../../../services/ProductService';
import BrandService from '../../../services/BrandService';
import { FaArrowAltCircleLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { urlImageProduct } from '../../../config';
import { useNavigate } from 'react-router-dom';

const ProductTrash = () => {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(0);
    const [brandNames, setBrandNames] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrashedProducts();
    }, [reload]);

    useEffect(() => {
        const fetchBrandNames = async () => {
            const names = {};
            for (const product of products) {
                try {
                    if(product.brandId !== null){
                        const brand = await BrandService.getById(product.brandId);
                        names[product.brandId] = brand !== null ? brand.name : "N/A";
                    }else{
                        names[product.brandId] = "N/A";
                    } 
                } catch (error) {
                    if (error.response && error.response.status === 503) {
                        names[product.brandId] = "N/A";
                        navigate('/admin/404');
                    } else {
                        names[product.brandId] = "N/A";
                        console.error("Error fetching data:", error);
                    }
                    
                }
            }
            setBrandNames(names);
        };
        fetchBrandNames();
    }, [products]);

    const fetchTrashedProducts = async () => {
        try {
            const result = await ProductService.getAll();
            setProducts(result.filter(product => product.status === 2));
        } catch (error) {
            console.error('Error fetching trashed users:', error);
            toast.error('Đã xảy ra lỗi khi tải danh sách đã xóa.');
        }
    };

    const restoreProduct = async (id) => {
        try {
            await ProductService.sitchStatus(id);
            setReload(Date.now());
            toast.success('Khôi phục thành công');
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Đã xảy ra lỗi khi khôi phục người dùng.');
        }
    };

    const deleteProduct = async (id) => {
        try {
            await ProductService.delete(id);
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
                <h1 className="d-inline">Sản phẩm : Thùng rác</h1>

                <div className="row mt-3 align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-warning">
                            <a href="/admin/product/index">Về danh sách</a>
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
                                                    onClick={() => restoreProduct(product.id)}
                                                    className="border-0 px-1 text-success"
                                                >
                                                    <FaArrowAltCircleLeft />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="btn-none px-1 text-danger"
                                                >
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
            </section>
        </div>
    );
}

export default ProductTrash;
