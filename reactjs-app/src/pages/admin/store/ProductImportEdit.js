import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductStoreService from '../../../services/ProductStoreService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ProductImportEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [storeId, setStoreId] = useState('');
    const [quantityOld, setQuantityOld] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [createdAt, setCreatedAt] = useState('');


    const [productId, setProductId] = useState('');
    const [optionValueId, setPOptionValueId] = useState('');
    const [soldQuantity, setSoldQuantity] = useState(0);
    const [priceStore, setPriceStore] = useState(0);
    const [quantityStore, setQuantityStore] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thông tin sản phẩm từ ProductStore
                const importData = await ProductStoreService.getImportById(id);
                setStoreId(importData.storeId);
                setQuantityOld(importData.quantity);
                setQuantity(importData.quantity);
                setPrice(importData.price);
                setDescription(importData.description);
                setCreatedBy(importData.createdBy);
                setCreatedAt(importData.createdAt);
                if(importData){
                    const storeData = await ProductStoreService.getById(importData.storeId);
                    setProductId(storeData.productId);
                    setPOptionValueId(storeData.optionValueId);
                    setSoldQuantity(storeData.soldQuantity);
                    setPriceStore(storeData.price);
                    setQuantityStore(storeData.quantity);
                }

            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/admin/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Chuyển đổi số lượng và giá thành số
        
        const updateProductImport = {
            storeId: storeId,
            quantity: quantity,
            price: price,
            description,
            createdBy,
            createdAt
        };

        const updatedProductStore = {
            productId,
            optionValueId,
            quantity: parseInt(quantityStore) + (parseInt(quantityOld) - parseInt(quantity)),
            soldQuantity,
            price: priceStore,
            createdBy,
        };
    
        try {
            const result = await ProductStoreService.updateImport(id,updateProductImport);
            if(result !== null){
                await ProductStoreService.update(id, updatedProductStore);
                toast.success('Cập nhật thành công');
                navigate("/admin/product/import/index", { replace: true });
            }
        } catch (error) {
            console.error('Error updating product store:', error);
            toast.error("Đã xảy ra lỗi khi cập nhật.");
        }

    };
    
    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Chỉnh sửa nhập hàng</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="info" size="sm" onClick={() => navigate("/admin/product/import/index", { replace: true })}>
                                <FaArrowLeft /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label><strong>Giá</strong></label>
                                <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Số lượng</strong></label>
                                <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả hàng nhập</strong></label>
                                <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="box-footer text-end px-2 py-2">
                                <button type="submit" className="btn btn-sm btn-success" name="THEM">
                                    <FaSave /> Lưu[Nhập hàng]
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}

export default ProductImportEdit;
