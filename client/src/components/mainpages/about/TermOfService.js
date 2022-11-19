import React from 'react'

function TermOfService() {
    return (
        <div>
            <h1 className="heading">Điều khoản dịch vụ</h1>
            <div className="content">
            <div className="term">
                    <h3 className="term_heading">1. Giới thiệu</h3>
                    <p>Chào mừng quý khách hàng đến với website chúng tôi.</p>
                    <br />
                    <p>Khi quý khách hàng truy cập vào trang website của chúng tôi có nghĩa là quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước. Và khi quý khách tiếp tục sử dụng trang web, sau khi các thay đổi về Điều khoản này được đăng tải, có nghĩa là quý khách chấp nhận với những thay đổi đó.</p>
                    <br />
                    <p>Quý khách hàng vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi.</p>
                    <br />
                </div>
                <div className="term">
                    <h3 className="term_heading">2. Hướng dẫn sử dụng website</h3>
                    <p>Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp. Khách hàng đảm bảo có đầy đủ hành vi dân sự để thực hiện các giao dịch mua bán hàng hóa theo quy định hiện hành của pháp luật Việt Nam.</p>
                    <br />
                    <p>Trong suốt quá trình đăng ký, quý khách đồng ý nhận email quảng cáo từ website. Nếu không muốn tiếp tục nhận mail, quý khách có thể từ chối bằng cách nhấp vào đường link ở dưới cùng trong mọi email quảng cáo.</p>
                    <br />
                </div>
                <div className="term">
                    <h3 className="term_heading">3. Thanh toán an toàn và tiện lợi</h3>
                    <p>Người mua có thể tham khảo các phương thức thanh toán sau đây và lựa chọn áp dụng phương thức phù hợp:</p>
                    <br />

                    <p><span className="method">Cách 1:</span> Thanh toán trực tiếp (người mua nhận hàng tại địa chỉ người bán)</p>
                    <br />
                    <p><span className="method">Cách 2:</span> Thanh toán sau (COD – giao hàng và thu tiền tận nơi)</p>
                    <br />
                    <p><span className="method">Cách 3:</span> Thanh toán online qua thẻ tín dụng, chuyển khoản</p>
                    <br />
                </div>
            </div>
        </div>
    )
}

export default TermOfService