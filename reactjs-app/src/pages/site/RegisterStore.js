import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../services/UserService';
import '../../assets/styles/registerStore.css';

const RegisterStore = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id: userId } = useParams();

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleRegisterClick = () => {
        if (isChecked) {
            setIsSubmitting(true);
            UserService.updateToStore(userId)
                .then(() => {
                    navigate('/my-user');
                })
                .catch((error) => {
                    console.error('Failed to update user to store:', error);
                    setIsSubmitting(false);
                });
        }
    };

    return (
        <div className="register-store-container">
            <h1>Đăng Ký Cửa Hàng</h1>
            <div className="policy-list">
                <h2>Chính Sách Bán Hàng</h2>
                <ul>
                    <li>
                        <strong>Chính Sách Hoàn Tiền:</strong> Người bán phải tuân thủ các quy định về hoàn tiền và hoàn trả hàng hóa. Hoàn tiền phải được xử lý trong vòng 14 ngày kể từ khi nhận được yêu cầu từ khách hàng.
                    </li>
                    <li>
                        <strong>Chính Sách Vận Chuyển:</strong> Người bán cần đảm bảo thời gian và chất lượng vận chuyển. Tất cả các đơn hàng phải được gửi đi trong vòng 2 ngày làm việc kể từ khi nhận được đơn đặt hàng.
                    </li>
                    <li>
                        <strong>Chính Sách Bảo Hành:</strong> Các sản phẩm phải đi kèm với chính sách bảo hành rõ ràng, phù hợp và ít nhất đạt tiêu chuẩn tối thiểu đối với từng loại hàng..
                    </li>
                    <li>
                        <strong>Chính Sách Về Giá Cả:</strong> Giá cả phải được niêm yết rõ ràng và không thay đổi sau khi khách hàng đặt hàng. Người bán không được phép thêm bất kỳ phí ẩn nào.
                    </li>
                    <li>
                        <strong>Chính Sách Về Hình Ảnh Sản Phẩm:</strong> Hình ảnh sản phẩm phải trung thực và chính xác với sản phẩm thực tế. Sử dụng hình ảnh không trung thực có thể dẫn đến việc bị khóa tài khoản.
                    </li>
                    <li>
                        <strong>Chính Sách Về Đổi Trả:</strong> Người bán phải cung cấp quy định về điều kiện và quy trình đổi trả sản phẩm, bao gồm việc chịu trách nhiệm chi phí vận chuyển trong quá trình đổi trả.
                    </li>
                    <li>
                        <strong>Chính Sách Về Thương Hiệu:</strong> Người bán phải tôn trọng các quyền thương hiệu và bản quyền. Không được phép bán các sản phẩm giả mạo hoặc vi phạm bản quyền.
                    </li>
                    <li>
                        <strong>Chính Sách Về Dữ Liệu Khách Hàng:</strong> Người bán phải bảo mật và không chia sẻ dữ liệu khách hàng cho bên thứ ba mà không có sự đồng ý của khách hàng.
                    </li>
                    <li>
                        <strong>Chính Sách Về Thanh Toán:</strong> Người bán phải cung cấp các phương thức thanh toán an toàn và đảm bảo rằng mọi giao dịch được thực hiện một cách bảo mật.
                    </li>
                    <li>
                        <strong>Chính Sách Về Dịch Vụ Khách Hàng:</strong> Người bán phải cung cấp dịch vụ khách hàng kịp thời và chuyên nghiệp. Phản hồi tất cả các yêu cầu của khách hàng trong vòng 24 giờ.
                    </li>
                </ul>
            </div>
            <div className="policy-agreement">
                <input
                    type="checkbox"
                    id="policy-agreement"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="policy-agreement">
                    Tôi đồng ý với các chính sách về bán hàng.
                </label>
            </div>
            <button
                className="register-btn"
                onClick={handleRegisterClick}
                disabled={!isChecked || isSubmitting}
            >
                Đăng Ký
            </button>
        </div>
    );
}

export default RegisterStore;
