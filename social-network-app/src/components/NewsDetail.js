import React, { Component } from 'react';
import './../assets/css/news_detail.css';

class NewsDetail extends Component {
    render() {
        return (
            <div className="container-fluid one-news-detail">
                <div className="row one-news-header">
                    <div className="col-md-2 img-responsive">
                    <img src="https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg" className="img-circle" alt />
                    </div>
                    <div className="col-md-7 news-owner-name">
                    <h4><strong>Nguyễn Văn Phúc</strong></h4>
                    <p>@nvp1103</p>
                    </div>
                    <div className="col-md-3 news-status">
                    <button type="button" className="btn btn-primary">Đang theo dõi</button>
                    {/* <button type="button" class="btn btn-danger">Bỏ theo dõi</button> */}
                    </div>
                </div> {/* end one-news-header */}
                <div className="row one-news-content">
                    <div className="text">
                    <h4>181201 MMA #정국 #BTS #JUNGKOOK  @BTS_twt legend</h4>
                    <h4>181201 MMA #정국 #BTS #JUNGKOOK  @BTS_twt legend</h4>
                    <h4>181201 MMA #정국 #BTS #JUNGKOOK  @BTS_twt legend</h4>
                    </div>
                    <div className="imgs">
                    {/* truong hop co 1 anh */}
                    <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt />
                    {/* truong hop co 2 anh */}
                    <div className="col-md-6">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt />
                    </div>
                    <div className="col-md-6">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt />
                    </div>
                    <div className="col-md-9">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt />
                    </div>
                    {/* truong hop nhieu hon 3 anh */}
                    <div className="col-md-3">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt />
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt />
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt />
                    </div>
                    </div>
                    <div className="videos">
                    </div>
                </div> {/* end one-new-content */}
                <div className="row one-news-status">
                    <div className="col-md-12 post-time">
                    <p>06:13 - 1 thg 12, 2018</p>
                    </div>
                    <ul className="stats col-md-12">
                    <li>Tweet lại: <strong>2.619</strong> </li>
                    <li>Lượt thích: <strong>5.399</strong></li>
                    </ul>
                    <ul className="associate col-md-12">
                    <li><button><i className="far fa-comment">1234</i></button></li>
                    <li><button><i className="fas fa-sync-alt">1234</i></button></li>
                    <li><button><i className="far fa-heart">1234</i></button></li>
                    <li><button><i className="far fa-envelop">1234</i></button></li>
                    </ul>
                </div> {/* end one-new-status */}
                <div className="row one-news-reply">
                    <form className="form-inline" action="/action_page.php">
                    <div className="form-group">
                        <label htmlFor="email">
                        <img src="https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg" className="img-circle" alt />
                        </label>
                        <input type="text" className="form-control" placeholder="Để lại bình luận của bạn" name="your_comment" />
                    </div>
                    </form>
                </div> {/* end one-new-reply */}
                <div className="row one-news-comments">
                    <div className="col-md-2 img">
                    <img src="https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg" className="img-circle" alt />
                    </div>
                    <div className="col-md-10 comment-content">
                    <pre><strong className="name">Phuc Nguyen</strong><i className="nickname"> @phucnguyen</i><i className="time">06:13 - 1 thg 12, 2018</i></pre>
                    <div className="content">
                        <h4>A CHRISTMAS HIT IS COMING WBKA CHRISTMAS HIT IS COMING WBKA CHRISTMAS HIT IS COMING WBK</h4>
                    </div>
                    <ul className="associate">
                        <li><button><i className="far fa-comment">1234</i></button></li>
                        <li><button><i className="fas fa-sync-alt">1234</i></button></li>
                        <li><button><i className="far fa-heart">1234</i></button></li>
                        <li><button><i className="far fa-envelop">1234</i></button></li>
                    </ul>
                    </div>
                </div> {/* end one-new-comments */}
                {/* truong hop comment co tra loi */}
                <div className="row one-news-comments have-reply">
                    <div className="col-md-2 img">
                    <img src="https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg" className="img-circle" alt />
                    </div>
                    <div className="col-md-10 comment-content">
                    <pre><strong className="name">Phuc Nguyen</strong><i className="nickname"> @phucnguyen</i><i className="time">06:13 - 1 thg 12, 2018</i></pre>
                    <div className="content">
                        <h4>A CHRISTMAS HIT IS COMING WBKA CHRISTMAS HIT IS COMING WBKA CHRISTMAS HIT IS COMING WBK</h4>
                    </div>
                    <ul className="associate col-md-12">
                        <li><button><i className="far fa-comment">1234</i></button></li>
                        <li><button><i className="fas fa-sync-alt">1234</i></button></li>
                        <li><button><i className="far fa-heart">1234</i></button></li>
                        <li><button><i className="far fa-envelop">1234</i></button></li>
                    </ul>
                    </div>
                </div> {/* end one-new-comments */}
                <div className="row one-news-comments">
                    <div className="col-md-2 img">
                    <img src="https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg" className="img-circle" alt />
                    </div>
                    <div className="col-md-10 comment-content">
                    <pre><strong className="name">Phuc Nguyen</strong><i className="nickname"> @phucnguyen</i><i className="time">06:13 - 1 thg 12, 2018</i></pre>
                    <div className="content">
                        <h4>A CHRISTMAS HIT IS COMING WBKA CHRISTMAS HIT IS COMING WBKA CHRISTMAS HIT IS COMING WBK</h4>
                    </div>
                    <ul className="associate col-md-12">
                        <li><button><i className="far fa-comment">1234</i></button></li>
                        <li><button><i className="fas fa-sync-alt">1234</i></button></li>
                        <li><button><i className="far fa-heart">1234</i></button></li>
                        <li><button><i className="far fa-envelop">1234</i></button></li>
                    </ul>
                    </div>
                </div> {/* end one-new-comments */}
                </div> 
        );
    }
}

export default NewsDetail;