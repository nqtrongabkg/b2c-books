import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserService from '../../../services/UserService';
import BannerService from '../../../services/BannerService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const BannerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState(null);
    const [createdBy, setCreateBy] = useState("");
    const [stringImageDefault, setStringImageDefault] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const Data = await BannerService.getById(id);

                setName(Data.name);
                setDescription(Data.description);
                setStatus(Data.status);
                setCreateBy(Data.createdBy);
                setStringImageDefault(Data.image);

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


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const updateData = {
                name: name,
                description,
                createdBy,
                status: status,
            };
            const path = {
                path: "banners"
            };
            const deleteIfExitsImage = await BannerService.getById(id);
            console.log("image ole = ", deleteIfExitsImage.avatar);
            if(image !== null){
                if(deleteIfExitsImage.image !== null){
                    const deleteImage = {
                        path: "banners",
                        filename: deleteIfExitsImage.image
                    };
                    console.log("delete data = ", deleteImage);
                    await UserService.deleteImage(deleteImage);
                }
            }
    
            const result = await BannerService.update(id, updateData);
            if (result) {
                if (image !== null) { // Kiểm tra avatar khác null
                    const stringImage = await UserService.saveImage(id, path, image);
                    if(stringImage !== null){
                        const data = {
                            id: result.id,
                            image: stringImage
                        };
                        console.log("setimage data is: ", data);
                        await BannerService.setImage(data);
                    }
                }else{
                    const data = {
                        id: result.id,
                        image: stringImageDefault
                    };
                    console.log("setimage data is: ", data);
                    await BannerService.setImage(data);
                }
                toast.success("User updated successfully!");
                navigate("/admin/banner/index", { replace: true });
            }
    
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error("Failed to update user.");
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Cập nhật Banner</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" as={Link} to="/admin/banner/index">
                                <FaSave /> Về danh sách
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label><strong>Tên banner</strong></label>
                                <input type="text" name="name" className="form-control" placeholder="Tên" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label><strong>Mô tả</strong></label>
                                <input type="text" name="description" className="form-control" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            
                        </div>
                        <div className="col-md-6">
                            
                            <div className="mb-3">
                                <label><strong>Ảnh đại diện</strong></label>
                                <input type="file" id="image" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
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

export default BannerEdit;
