import React from 'react'
import Intro from '../../../images/slider-1.png'
function Introduction() {
    return (
        <div>
            <h1 className="heading">Giới thiệu</h1>
            <img src={Intro} alt="" />
            <div className="content">
                <p><span className="brand-name">ThiVLevel</span> là local brand được thành lập và xuất hiện lần đầu tiên vào đầu tháng 09-2022.</p>
                <br />
                <p>Với nổ lực không ngừng <span className="brand-name">ThiVLevel</span> đã mang đến một góc nhìn khác hơn về giá thành của thương hiệu VIỆT
                    Bước ngoặc lớn nhất vào tháng 09-2022 <span className="brand-name">ThiVLevel</span> tự hào là local đầu tiên đưa sản phẩm về mức giá #SALE 99K nhưng vẫn đảm bảo tuyệt đối chất lượng đầu ra của thương hiệu với tiêu chí : “ rẻ - đẹp - chất lượng “</p>
                <br />
                <p>Và hứa hẹn trong tương lai chúng ta sẽ cùng bùng nổ hơn nữa chứ không phải chỉ riêng khoảnh khắc này</p>
                <br />
                <p>Hãy cùng nhau đón chờ những sản phẩm mới nhất từ <span className="brand-name">ThiVLevel</span> nhé. Cảm ơn các bạn rất nhiều!</p>
            </div>
        </div>
    )
}

export default Introduction