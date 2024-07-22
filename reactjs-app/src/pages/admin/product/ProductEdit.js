import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import BrandService from '../../../services/BrandService';
import CategoryService from '../../../services/CategoryService';
import TagService from '../../../services/TagService';
import ProductCategoryService from '../../../services/ProductCategory';
import ProductTagService from '../../../services/ProductTagService';
import UserService from '../../../services/UserService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [price, setPrice] = useState(1);
    const [description, setDescription] = useState("");
    const [detail, setDetail] = useState("");
    const [evaluate, setEvaluate] = useState(1);
    const [createdBy, setCreatedBy] = useState("");
    const [status, setStatus] = useState(1);
    const [stringImageDefault, setStringImageDefault] = useState("");
    const [image, setImage] = useState(null);
    const [brandId, setBrandId] = useState("");
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategories, setCurrentCategories] = useState([])
    // const [oldCategories, setOldCategories] = useState([])
    const [tags, setTags] = useState([]);
    const [currentTags, setCurrentTags] = useState([]);
    // const [oldTags, setOldTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await ProductService.getById(id);

                const brandResponse = await BrandService.getAll();
                const filteredBrands = brandResponse.filter(brand => brand.status === 1 || brand.status === 3);
                setBrands(filteredBrands);

                const categoryResponse = await CategoryService.getAll();
                const filteredCategories = categoryResponse.filter(category => category.status === 1 || category.status === 3);
                setCategories(filteredCategories);

                const getCurrentCategories = await ProductCategoryService.getByProductId(id);
                setCurrentCategories(getCurrentCategories);
                // setOldCategories(getCurrentCategories);

                const tagResponse = await TagService.getAll();
                const filteredTags = tagResponse.filter(tag => tag.status === 1 || tag.status === 3);
                setTags(filteredTags);

                const getCurrentTags = await ProductTagService.getByProductId(id);
                setCurrentTags(getCurrentTags);
                // setOldTags(getCurrentTags);

                setName(productData.name);
                setPrice(productData.price);
                setDescription(productData.description);
                setDetail(productData.detail);
                setEvaluate(productData.evaluate);
                setCreatedBy(productData.createdBy);
                setStatus(productData.status);
                setStringImageDefault(productData.image);
                setBrandId(productData.brandId);

                // Create arrays of selected tag and category IDs
                const selectedCategoryIds = getCurrentCategories.map(category => category.categoryId);
                const selectedTagIds = getCurrentTags.map(tag => tag.tagId);

                // Update currentCategories and currentTags with selected IDs
                setCurrentCategories(selectedCategoryIds);
                setCurrentTags(selectedTagIds);
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

    // Xử lý sự kiện khi thay đổi chọn tag và category
    const handleTagChange = (tagId, checked) => {
        const updatedTags = checked
            ? [...currentTags, tagId] // Thêm tag vào danh sách đã chọn
            : currentTags.filter((id) => id !== tagId); // Loại bỏ tag ra khỏi danh sách đã chọn
        setCurrentTags(updatedTags);
    };

    const handleCategoryChange = (categoryId, checked) => {
        const updatedCategories = checked
            ? [...currentCategories, categoryId] // Thêm category vào danh sách đã chọn
            : currentCategories.filter((id) => id !== categoryId); // Loại bỏ category ra khỏi danh sách đã chọn
        setCurrentCategories(updatedCategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("category current: ", currentCategories);
        console.log("tag current: ", currentTags);
        try {
            const ProductDataUpdate = {
                name: name,
                price: price,
                description: description,
                detail: detail,
                evaluate: evaluate,
                brandId: brandId,
                createdBy: createdBy,
                status: status,
                tagIds: currentTags,
                categoryIds: currentCategories,
            };

            if(id){
                await ProductCategoryService.deleteByProductId(id);
                await ProductTagService.deleteByProductId(id);
            }
            const path = {
                path: "products"
            };
            const deleteIfExitsImage = await ProductService.getById(id);
            if (image !== null) {
                if (deleteIfExitsImage.image !== null) {
                    const deleteImage = {
                        path: "products",
                        filename: deleteIfExitsImage.image
                    };
                    await UserService.deleteImage(deleteImage);
                }
            }

            console.log("product update: ", ProductDataUpdate);
            const result = await ProductService.update(id, ProductDataUpdate);
            if (result) {
                if (image !== null) { // Kiểm tra image khác null
                    const stringImage = await UserService.saveImage(id, path, image);
                    if (stringImage !== null) {
                        const data = {
                            id: result.id,
                            image: stringImage
                        };
                        await ProductService.setImage(data);
                    }
                } else {
                    const data = {
                        id: result.id,
                        image: stringImageDefault
                    };
                    await ProductService.setImage(data);
                }
                toast.success("User updated successfully!");
                navigate("/admin/product/index", { replace: true });



            }
        } catch (error) {
            toast.error("Failed to update user.");
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Cập nhật sản phẩm</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" as={Link} to="/admin/product/index">
                                <FaSave /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Tên(*)</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Tên sản phẩm" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text" name="description" className="form-control" placeholder="Mô tả sản phẩm" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Chi tiết</strong></label>
                                <input type="text" name="detail" className="form-control" placeholder="Chi tiết sản phẩm" value={detail} onChange={e => setDetail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Giá bán</strong></label>
                                <input type="number" name="price" className="form-control" placeholder="Giá bán" value={price} onChange={e => setPrice(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Ảnh</strong></label>
                                <input type="file" id="image" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Thương hiệu</strong></label>
                                {brands && brands.length > 0 && (
                                    <select
                                        name="brand"
                                        className="form-select"
                                        onChange={(e) => setBrandId(e.target.value)}
                                        value={brandId ? brandId : ""}
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>

                                )}
                            </div>

                            {/* Categories */}
                            <div className="mb-3">
                                <label><strong>Danh mục</strong></label>
                                <div className="form-check">
                                    {categories.map((category) => (
                                        <div key={category.id} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={category.id}
                                                value={category.id}
                                                checked={currentCategories.includes(category.id)}
                                                onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor={category.id}>
                                                {category.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mb-3">
                                <label><strong>Tags</strong></label>
                                <div className="form-check">
                                    {tags.map((tag) => (
                                        <div key={tag.id} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={tag.id}
                                                value={tag.id}
                                                checked={currentTags.includes(tag.id)}
                                                onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor={tag.id}>
                                                {tag.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label><strong>Trạng thái</strong></label>
                                <select name="status" className="form-select" onChange={(e) => { setStatus(e.target.value) }}
                                    value={status}>
                                    <option value="1">Hoạt động</option>
                                    <option value="2">Không hoạt động</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content-header my-2">
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button type="submit" className="btn btn-success btn-sm">
                                <FaSave /> Lưu [Cập nhật]
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
};

export default ProductEdit;
