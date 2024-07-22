import React, { useState, useEffect } from 'react';
import ConfigService from '../../../services/ConfigService';
import { toast } from 'react-toastify';

const ConfigIndex = () => {
    const [config, setConfig] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [author, setAuthor] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [zalo, setZalo] = useState("");
    const [facebook, setFacebook] = useState("");
    const [address, setAddress] = useState("");
    const [youtube, setYoutube] = useState("");
    const [metadesc, setMetadesc] = useState("");
    const [metakey, setMetakey] = useState("");

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const response = await ConfigService.show(1);
            if (response.status === true) {
                setConfig(response.config);
                // Set the state variables with the loaded data
                setAuthor(response.config.author);
                setEmail(response.config.email);
                setPhone(response.config.phone);
                setZalo(response.config.zalo);
                setFacebook(response.config.facebook);
                setAddress(response.config.address);
                setYoutube(response.config.youtube);
                setMetadesc(response.config.metadesc);
                setMetakey(response.config.metakey);
            }
        } catch (e) {
            if (error.response && error.response.status === 503) {
                navigate('/admin/404');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    }

    const updateConfig = async () => {
        const updatedData = {
            "author": author,
            "email": email,
            "phone": phone,
            "zalo": zalo,
            "facebook": facebook,
            "address": address,
            "youtube": youtube,
            "metadesc": metadesc,
            "metakey": metakey
        };

        try {
            const result = await ConfigService.update(updatedData, 1);
            if (result.status) {
                toast.success(result.message);
                setIsEditing(false);
                loadConfig();
            }
        } catch (error) {
            console.error('Lỗi cập nhật config:', error);
        }
    }

    return (
        <div>
            <div className="col my-2">
                <div className="col-md-5">
                    <label>Tác giả</label>
                    <input
                        type="text"
                        name="author"
                        id='author'
                        className="form-control"
                        value={isEditing ? author : config?.author}
                        onChange={(e) => setAuthor(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md-5">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        id='email'
                        className="form-control"
                        value={isEditing ? email : config?.email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md-5">
                    <label>Điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        id='phone'
                        className="form-control"
                        value={isEditing ? phone : config?.phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md-5">
                    <label>Zalo</label>
                    <input
                        type="text"
                        name="zalo"
                        id='zalo'
                        className="form-control"
                        value={isEditing ? zalo : config?.zalo}
                        onChange={(e) => setZalo(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md-5">
                    <label>Facebook</label>
                    <input
                        type="text"
                        name="facebook"
                        id='facebook'
                        className="form-control"
                        value={isEditing ? facebook : config?.facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md">
                    <label>Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        id='address'
                        className="form-control"
                        value={isEditing ? address : config?.address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md">
                    <label>YouTube</label>
                    <input
                        type="text"
                        name="youtube"
                        id='youtube'
                        className="form-control"
                        value={isEditing ? youtube : config?.youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md">
                    <label>META DESC</label>
                    <input
                        type="text"
                        name="metadesc"
                        id='metadesc'
                        className="form-control"
                        value={isEditing ? metadesc : config?.metadesc}
                        onChange={(e) => setMetadesc(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="col-md">
                    <label>META KEY</label>
                    <input
                        type="text"
                        name="metakey"
                        id='metakey'
                        className="form-control"
                        value={isEditing ? metakey : config?.metakey}
                        onChange={(e) => setMetakey(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>

                <div className="col-md">
                    <div className="col-12 my-2">
                        {/* Buttons for editing and updating */}
                        {!isEditing ? (
                            <button type="button" className="btn btn-success" onClick={() => setIsEditing(true)}>
                                Sửa
                            </button>
                        ) : (
                            <button type="button" className="btn btn-success" onClick={updateConfig}>
                                Lưu
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfigIndex;
