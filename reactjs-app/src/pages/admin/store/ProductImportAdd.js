import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductStoreService from '../../../services/ProductStoreService';
import ProductService from '../../../services/ProductService';
import ProductOptionService from '../../../services/ProductOptionService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ProductImportAdd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [optionValue, setOptionValue] = useState(null);
    const [option, setOption] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [quantityOld, setQuantityOld] = useState(0);
    const [soldQuantity, setSoldQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceOld, setPriceOld] = useState(0);
    const [description, setDescription] = useState('');
    const [productId, setProductId] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [optionValueId, setOptionValueId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thông tin sản phẩm từ ProductStore
                const store = await ProductStoreService.getById(id);
                const fetchedProduct = await ProductService.getById(store.productId);
                setProduct(fetchedProduct);
                setQuantity(store.quantity);
                setQuantityOld(store.quantity);
                setSoldQuantity(store.soldQuantity);
                setPrice(store.price);
                setPriceOld(store.price);
                setProductId(store.productId);
                setCreatedBy(store.createdBy);
                setOptionValueId(store.optionValueId);

                // Lấy thông tin giá trị lựa chọn từ OptionValue
                const fetchedOptionValue = await ProductOptionService.getOptionValue(store.optionValueId);
                setOptionValue(fetchedOptionValue);

                // Lấy thông tin lựa chọn từ Option
                const fetchedOption = await ProductOptionService.getById(fetchedOptionValue.optionId);
                setOption(fetchedOption);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Chuyển đổi số lượng và giá thành số
        const newQuantity = parseInt(quantity, 10);
        const newPrice = parseFloat(price);
        const newTotalPrice = ((newQuantity * newPrice) + (quantityOld * priceOld)) / (newQuantity + quantityOld);
    
        const updatedProductStore = {
            productId,
            optionValueId,
            quantity: newQuantity + quantityOld,
            soldQuantity,
            price: newTotalPrice.toFixed(2),
            createdBy,
        };
        const createdProductImport = {
            storeId: id,
            quantity: newQuantity,
            price: newPrice,
            description,
            createdBy,
        };
    
        try {
            await ProductStoreService.import(createdProductImport);
            await ProductStoreService.update(id, updatedProductStore);
            toast.success('Cập nhật kho hàng sản phẩm thành công');
            navigate("/admin/product/store/index", { replace: true });
        } catch (error) {
            console.error('Error updating product store:', error);
            toast.error("Đã xảy ra lỗi khi cập nhật kho hàng sản phẩm.");
        }
    };
    

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Nhập hàng</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="info" size="sm" onClick={() => navigate("/admin/product/store/index", { replace: true })}>
                                <FaArrowLeft /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label><strong>Tên sản phẩm</strong></label>
                                <input type="text" className="form-control" value={product ? product.name : ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label><strong>Lựa chọn</strong></label>
                                <input type="text" className="form-control" value={option ? option.name : ''} readOnly />
                            </div>
                            <div className="mb-3">
                                <label><strong>Option Value</strong></label>
                                <input type="text" className="form-control" value={optionValue ? optionValue.value : ''} readOnly />
                            </div>
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

export default ProductImportAdd;
