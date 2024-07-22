import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import RoleService from '../../services/RoleService';
import { urlImageUser } from '../../config';
import { toast } from 'react-toastify';
import { useUserContext } from '../../layouts/LayoutSite';
import userimage from '../../assets/images/logo/user.jpg';

const UserManager = () => {
    const { logout } = useUserContext();
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState(1);
    const [avatar, setAvatar] = useState(null);
    const [role, setRole] = useState(null);
    const [stringImageDefault, setStringImageDefault] = useState("");

    const [userDisplay, setUserDisplay] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await UserService.getUserById(user.userId);
                setUserDisplay(userData);
                setName(userData.name || "");
                setUserName(userData.userName || "");
                setPassword(userData.password || "");
                setPhone(userData.phone || "");
                setEmail(userData.email || "");
                setAddress(userData.address || "");
                setRole(userData.role || "");
                setStatus(userData.status || 1);
                setStringImageDefault(userData.avatar || "");
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [navigate, user.userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = {
                name,
                userName,
                password,
                phone,
                email,
                address,
                updatedBy: user.userId,
                role: await RoleService.getByRole(role.role),
                status,
            };
            const path = { path: "users" };
            const deleteIfExitsImage = await UserService.getUserById(user.userId);

            if (avatar !== null) {
                if (deleteIfExitsImage.avatar !== null) {
                    const deleteImage = { path: "users", filename: deleteIfExitsImage.avatar };
                    await UserService.deleteImage(deleteImage);
                }
            }
            // console.log("data update user:", userData);
            const result = await UserService.update(user.userId, userData);
            if (result) {
                if (avatar !== null) {
                    const stringImage = await UserService.saveImage(user.userId, path, avatar);
                    if (stringImage !== null) {
                        const data = { id: result.id, image: stringImage };
                        await UserService.setImage(data);
                    }
                } else {
                    const data = { id: result.id, image: stringImageDefault };
                    await UserService.setImage(data);
                }
                toast.success("Cập nhật thông tin thành công!");
                setEditMode(false);
                navigate("/my-user", { replace: true });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error("Cập nhật thông tin thất bại.");
        }
    };

    const formatDateToLocalDate = (datetimeString) => {
        const date = new Date(datetimeString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleLogout = () => {
        logout(); // Call logout function
        sessionStorage.removeItem('user'); // Remove user from sessionStorage
        navigate('/login'); // Navigate to login page after logout
    };

    return (
        <div>
            <section className="profile-section">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row mb-4">
                                            <div className="col-sm-3 fw-bold">Tên:</div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                                                ) : (
                                                    userDisplay && userDisplay.name
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-sm-3 fw-bold">Tên đăng nhập:</div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input type="text" className="form-control" value={userName} onChange={e => setUserName(e.target.value)} required />
                                                ) : (
                                                    userDisplay && userDisplay.userName
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-sm-3 fw-bold">Mật khẩu:</div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                                                ) : (
                                                    '********'
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-sm-3 fw-bold">Email:</div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                                                ) : (
                                                    userDisplay && userDisplay.email
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-sm-3 fw-bold">Số điện thoại:</div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
                                                ) : (
                                                    userDisplay && userDisplay.phone
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-sm-3 fw-bold">Địa chỉ:</div>
                                            <div className="col-sm-9">
                                                {editMode ? (
                                                    <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} required />
                                                ) : (
                                                    userDisplay && userDisplay.address
                                                )}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-3 fw-bold">Ngày tham gia:</div>
                                            <div className="col-sm-9">
                                                {userDisplay && userDisplay.createdAt ? formatDateToLocalDate(userDisplay.createdAt) : ""}
                                            </div>
                                        </div>
                                        {editMode && (
                                            <div className="row mt-4">
                                                <div className="col-sm-12 text-end">
                                                    <button type="submit" className="btn btn-success">Lưu</button>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center d-flex flex-column align-items-center">
                                    <img
                                        src={userDisplay && userDisplay.avatar ? `${urlImageUser}${userDisplay.avatar}` : userimage}
                                        alt="Chưa có ảnh"
                                        className="rounded-circle img-fluid mb-3"
                                        style={{ width: '150px' }}
                                    />
                                    {editMode ? (
                                        <div className="mb-3">
                                            <label><strong>Ảnh đại diện</strong></label>
                                            <input
                                                type="file"
                                                id="image"
                                                className="form-control"
                                                onChange={(e) => setAvatar(e.target.files[0])}
                                            />
                                        </div>
                                    ) : null}
                                    {!editMode ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary mb-2"
                                            onClick={() => setEditMode(true)}
                                        >
                                            Cập nhật thông tin
                                        </button>
                                    ) : null}
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default UserManager;
