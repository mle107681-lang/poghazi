const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@poghazi.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

/* =========================================================
   DANH SÁCH DỊCH VỤ
   ========================================================= */

const DICH_VU = [

    /* ===================== TIKTOK ===================== */

    {
        id: 'tiktok-view',
        danh_muc: 'TikTok',
        ten: 'Lượt xem TikTok',
        gia: 0.57,
        don_vi: '1 lượt',
        min: 100,
        max: 2147483647,
        hoat_dong: true
    },
    {
        id: 'tiktok-like',
        danh_muc: 'TikTok',
        ten: 'Lượt thích TikTok',
        gia: 1,
        don_vi: '1 lượt',
        min: 1,
        max: 10000000,
        hoat_dong: true
    },
    {
        id: 'tiktok-follow',
        danh_muc: 'TikTok',
        ten: 'Người theo dõi TikTok',
        gia: 83.73,
        don_vi: '100 người',
        min: 100,
        max: 5000,
        hoat_dong: true
    },
    {
        id: 'tiktok-share',
        danh_muc: 'TikTok',
        ten: 'Lượt chia sẻ TikTok',
        gia: 1,
        don_vi: '1 lượt',
        min: 10,
        max: 1000000,
        hoat_dong: true
    },
    {
        id: 'tiktok-save',
        danh_muc: 'TikTok',
        ten: 'Lượt lưu TikTok',
        gia: 1,
        don_vi: '1 lượt',
        min: 10,
        max: 1000000,
        hoat_dong: true
    },
    {
        id: 'tiktok-comment',
        danh_muc: 'TikTok',
        ten: 'Bình luận TikTok',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'tiktok-favorite',
        danh_muc: 'TikTok',
        ten: 'Yêu thích TikTok',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 1000000,
        hoat_dong: false
    },
    {
        id: 'tiktok-live-view',
        danh_muc: 'TikTok',
        ten: 'Lượt xem TikTok Live',
        gia: 0,
        don_vi: '1 lượt',
        min: 100,
        max: 1000000,
        hoat_dong: false
    },

    /* ===================== FACEBOOK ===================== */

    {
        id: 'facebook-like',
        danh_muc: 'Facebook',
        ten: 'Lượt thích bài viết',
        gia: 26,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'facebook-love',
        danh_muc: 'Facebook',
        ten: 'Cảm xúc Love',
        gia: 26,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'facebook-care',
        danh_muc: 'Facebook',
        ten: 'Cảm xúc Care',
        gia: 26,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'facebook-haha',
        danh_muc: 'Facebook',
        ten: 'Cảm xúc Haha',
        gia: 26,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'facebook-wow',
        danh_muc: 'Facebook',
        ten: 'Cảm xúc Wow',
        gia: 26,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'facebook-sad',
        danh_muc: 'Facebook',
        ten: 'Cảm xúc Sad',
        gia: 26,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'facebook-angry',
        danh_muc: 'Facebook',
        ten: 'Cảm xúc Angry',
        gia: 26,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'facebook-comment',
        danh_muc: 'Facebook',
        ten: 'Bình luận bài viết',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'facebook-comment-like',
        danh_muc: 'Facebook',
        ten: 'Thích bình luận',
        gia: 37,
        don_vi: '1 lượt',
        min: 20,
        max: 1000,
        hoat_dong: true
    },
    {
        id: 'facebook-share',
        danh_muc: 'Facebook',
        ten: 'Chia sẻ bài viết',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'facebook-follow',
        danh_muc: 'Facebook',
        ten: 'Theo dõi Facebook',
        gia: 0,
        don_vi: '1 lượt',
        min: 100,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'facebook-page-like',
        danh_muc: 'Facebook',
        ten: 'Like Fanpage',
        gia: 0,
        don_vi: '1 lượt',
        min: 100,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'facebook-live-view',
        danh_muc: 'Facebook',
        ten: 'Lượt xem Livestream',
        gia: 37,
        don_vi: '1 lượt',
        min: 10,
        max: 1000000,
        hoat_dong: true
    },
    {
        id: 'facebook-live-reaction',
        danh_muc: 'Facebook',
        ten: 'Cảm xúc Livestream',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'facebook-live-comment',
        danh_muc: 'Facebook',
        ten: 'Bình luận Livestream',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'facebook-story-view',
        danh_muc: 'Facebook',
        ten: 'Lượt xem Story',
        gia: 10,
        don_vi: '1 lượt',
        min: 100,
        max: 500000,
        hoat_dong: true
    },
    {
        id: 'facebook-review',
        danh_muc: 'Facebook',
        ten: 'Đánh giá Fanpage',
        gia: 0,
        don_vi: '1 lượt',
        min: 1,
        max: 10000,
        hoat_dong: false
    },

    /* ===================== YOUTUBE ===================== */

    {
        id: 'youtube-view',
        danh_muc: 'YouTube',
        ten: 'Lượt xem YouTube Adwords',
        gia: 9685,
        don_vi: '1000 lượt',
        min: 1000,
        max: 300000,
        hoat_dong: true
    },
    {
        id: 'youtube-watch',
        danh_muc: 'YouTube',
        ten: 'Thời gian xem YouTube',
        gia: 331,
        don_vi: '500 lượt/ngày',
        min: 500,
        max: 100000,
        hoat_dong: true
    },
    {
        id: 'youtube-like',
        danh_muc: 'YouTube',
        ten: 'Lượt thích YouTube',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'youtube-comment',
        danh_muc: 'YouTube',
        ten: 'Bình luận YouTube',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'youtube-sub',
        danh_muc: 'YouTube',
        ten: 'Người đăng ký YouTube',
        gia: 0,
        don_vi: '1 người',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'youtube-shorts-view',
        danh_muc: 'YouTube',
        ten: 'Lượt xem YouTube Shorts',
        gia: 0,
        don_vi: '1 lượt',
        min: 100,
        max: 10000000,
        hoat_dong: false
    },
    {
        id: 'youtube-live-view',
        danh_muc: 'YouTube',
        ten: 'Lượt xem YouTube Live',
        gia: 0,
        don_vi: '1 lượt',
        min: 100,
        max: 1000000,
        hoat_dong: false
    },

    /* ===================== INSTAGRAM ===================== */

    {
        id: 'instagram-follow',
        danh_muc: 'Instagram',
        ten: 'Người theo dõi Instagram',
        gia: 83.73,
        don_vi: '100 người',
        min: 100,
        max: 5000,
        hoat_dong: true
    },
    {
        id: 'instagram-like',
        danh_muc: 'Instagram',
        ten: 'Lượt thích Instagram',
        gia: 41.45,
        don_vi: '100 lượt',
        min: 100,
        max: 50000,
        hoat_dong: true
    },
    {
        id: 'instagram-reel',
        danh_muc: 'Instagram',
        ten: 'Lượt xem Reel',
        gia: 6,
        don_vi: '1 lượt',
        min: 100,
        max: 2147483647,
        hoat_dong: true
    },
    {
        id: 'instagram-comment',
        danh_muc: 'Instagram',
        ten: 'Bình luận Instagram',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'instagram-story-view',
        danh_muc: 'Instagram',
        ten: 'Lượt xem Story Instagram',
        gia: 0,
        don_vi: '1 lượt',
        min: 100,
        max: 1000000,
        hoat_dong: false
    },
    {
        id: 'instagram-save',
        danh_muc: 'Instagram',
        ten: 'Lượt lưu Instagram',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'instagram-share',
        danh_muc: 'Instagram',
        ten: 'Lượt chia sẻ Instagram',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },

    /* ===================== THREADS ===================== */

    {
        id: 'threads-like',
        danh_muc: 'Threads',
        ten: 'Thích trên Threads',
        gia: 172,
        don_vi: '10 lượt',
        min: 10,
        max: 20000,
        hoat_dong: true
    },
    {
        id: 'threads-follow',
        danh_muc: 'Threads',
        ten: 'Theo dõi Threads',
        gia: 0,
        don_vi: '1 người',
        min: 10,
        max: 100000,
        hoat_dong: false
    },
    {
        id: 'threads-view',
        danh_muc: 'Threads',
        ten: 'Lượt xem Threads',
        gia: 0,
        don_vi: '1 lượt',
        min: 100,
        max: 1000000,
        hoat_dong: false
    },
    {
        id: 'threads-comment',
        danh_muc: 'Threads',
        ten: 'Bình luận Threads',
        gia: 0,
        don_vi: '1 lượt',
        min: 10,
        max: 100000,
        hoat_dong: false
    },

    /* ===================== GOOGLE ===================== */

    {
        id: 'google-review',
        danh_muc: 'Google',
        ten: 'Đánh giá Google Maps 5 Sao',
        gia: 4186,
        don_vi: '1 đánh giá',
        min: 1,
        max: 20000,
        hoat_dong: true
    },

    /* ===================== ROBLOX ===================== */

    {
        id: 'roblox',
        danh_muc: 'Roblox',
        ten: 'Cày thuê Roblox',
        gia: 50000,
        don_vi: '1 dịch vụ',
        min: 1,
        max: 100,
        hoat_dong: true
    },
    {
        id: 'king-legacy',
        danh_muc: 'Roblox',
        ten: 'Cày thuê King Legacy',
        gia: 50000,
        don_vi: '1 dịch vụ',
        min: 1,
        max: 100,
        hoat_dong: true
    },
    {
        id: 'pet-simulator-99',
        danh_muc: 'Roblox',
        ten: 'Cày thuê Pet Simulator 99',
        gia: 50000,
        don_vi: '1 dịch vụ',
        min: 1,
        max: 100,
        hoat_dong: true
    }
];


/* =========================================================
   DATABASE
   ========================================================= */

function getDB() {
    return db.getData();
}

function saveDB() {
    db.saveData();
}


/* =========================================================
   HÀM PHỤ
   ========================================================= */

function taoMaDon() {
    const data = getDB();

    let ma;

    do {
        ma =
            'PG' +
            Date.now().toString(36).toUpperCase() +
            Math.random()
                .toString(36)
                .substring(2, 6)
                .toUpperCase();
    } while (
        data.donhang.some(x => x.ma === ma)
    );

    return ma;
}

function taoToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            la_admin: user.la_admin
        },
        JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
}

function auth(req, res, next) {
    const header =
        req.headers.authorization;

    if (
        !header ||
        !header.startsWith('Bearer ')
    ) {
        return res.status(401).json({
            thanh_cong: false,
            message: 'Bạn chưa đăng nhập'
        });
    }

    try {
        req.user = jwt.verify(
            header.split(' ')[1],
            JWT_SECRET
        );

        next();

    } catch {
        return res.status(401).json({
            thanh_cong: false,
            message:
                'Token không hợp lệ hoặc đã hết hạn'
        });
    }
}

function admin(req, res, next) {
    if (
        Number(req.user.la_admin) !== 1
    ) {
        return res.status(403).json({
            thanh_cong: false,
            message:
                'Bạn không có quyền Admin'
        });
    }

    next();
}

function timUser(id) {
    return getDB().users.find(
        user =>
            Number(user.id) === Number(id)
    );
}

function timDichVu(id) {
    return DICH_VU.find(
        service =>
            service.id === id
    );
}

function heSoDonVi(donVi) {
    if (donVi === '1000 lượt')
        return 1000;

    if (donVi === '500 lượt/ngày')
        return 500;

    if (donVi === '100 lượt')
        return 100;

    if (donVi === '100 người')
        return 100;

    if (donVi === '10 lượt')
        return 10;

    return 1;
}

function tinhGia(service, soLuong) {
    return (
        Number(soLuong) /
        heSoDonVi(service.don_vi)
    ) * Number(service.gia);
}


/* =========================================================
   TRANG CHỦ
   ========================================================= */

app.get('/', (req, res) => {
    res.json({
        thanh_cong: true,
        website: 'POGHAZI',
        server: 'online',
        version: '2.0.0'
    });
});


/* =========================================================
   DỊCH VỤ
   ========================================================= */

app.get('/api/dich-vu', (req, res) => {
    res.json({
        thanh_cong: true,
        dich_vu: DICH_VU
    });
});


/* =========================================================
   ĐĂNG KÝ
   ========================================================= */

app.post(
    '/api/dang-ky',
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Vui lòng nhập email và mật khẩu'
                });
            }

            if (
                String(password).length < 6
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Mật khẩu phải có ít nhất 6 ký tự'
                });
            }

            const data = getDB();

            const emailLower =
                String(email)
                    .trim()
                    .toLowerCase();

            if (
                data.users.some(
                    u => u.email === emailLower
                )
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Email này đã được đăng ký'
                });
            }

            const passwordHash =
                await bcrypt.hash(
                    password,
                    10
                );

            const user = {
                id: data.nextUserId++,
                email: emailLower,
                password: passwordHash,
                so_du: 0,
                coin: 1000,
                la_admin: 0,
                ngay_tao:
                    new Date().toISOString()
            };

            data.users.push(user);

            saveDB();

            res.json({
                thanh_cong: true,
                message:
                    'Đăng ký thành công',
                user: {
                    id: user.id,
                    email: user.email,
                    so_du: user.so_du,
                    la_admin:
                        user.la_admin
                }
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                thanh_cong: false,
                message: 'Lỗi server'
            });
        }
    }
);


/* =========================================================
   ĐĂNG NHẬP
   ========================================================= */

app.post(
    '/api/dang-nhap',
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;

            const emailLower =
                String(email || '')
                    .trim()
                    .toLowerCase();

            const user =
                getDB().users.find(
                    u =>
                        u.email ===
                        emailLower
                );

            if (!user) {
                return res.status(401).json({
                    thanh_cong: false,
                    message:
                        'Email hoặc mật khẩu không đúng'
                });
            }

            const dungMatKhau =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!dungMatKhau) {
                return res.status(401).json({
                    thanh_cong: false,
                    message:
                        'Email hoặc mật khẩu không đúng'
                });
            }

            res.json({
                thanh_cong: true,
                message:
                    'Đăng nhập thành công',
                token:
                    taoToken(user),
                user: {
                    id: user.id,
                    email: user.email,
                    so_du: user.so_du,
                    la_admin:
                        user.la_admin
                }
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                thanh_cong: false,
                message: 'Lỗi server'
            });
        }
    }
);


/* =========================================================
   THÔNG TIN TÀI KHOẢN
   ========================================================= */

app.get(
    '/api/thong-tin-tai-khoan',
    auth,
    (req, res) => {

        const user =
            timUser(req.user.id);

        if (!user) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy tài khoản'
            });
        }

        res.json({
            thanh_cong: true,
            user: {
                id: user.id,
                email: user.email,
                so_du: user.so_du,
                la_admin:
                    user.la_admin,
                ngay_tao:
                    user.ngay_tao
            }
        });
    }
);


/* =========================================================
   LỊCH SỬ GIAO DỊCH - USER
   ========================================================= */

app.get(
    '/api/giao-dich',
    auth,
    (req, res) => {

        const data = getDB();

        const giaoDich =
            data.lichsu_giao_dich
                .filter(
                    x =>
                        Number(x.user_id) ===
                        Number(req.user.id)
                )
                .sort(
                    (a, b) =>
                        new Date(b.thoi_gian) -
                        new Date(a.thoi_gian)
                );

        res.json({
            thanh_cong: true,
            giao_dich: giaoDich
        });
    }
);


/* =========================================================
   TẠO YÊU CẦU NẠP TIỀN
   ========================================================= */

app.post(
    '/api/nap-tien/tao-yeu-cau',
    auth,
    (req, res) => {

        const soTien =
            Number(req.body.so_tien);

        const noiDung =
            String(
                req.body.noi_dung || ''
            ).trim();

        if (
            !Number.isFinite(soTien) ||
            soTien <= 0
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Số tiền không hợp lệ'
            });
        }

        if (soTien < 1000) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Số tiền nạp tối thiểu là 1.000đ'
            });
        }

        const data = getDB();

        if (!Array.isArray(
            data.yeu_cau_nap_tien
        )) {
            data.yeu_cau_nap_tien = [];
        }

        const yeuCau = {
            id:
                data.nextDepositId++
                || 1,
            user_id:
                Number(req.user.id),
            email:
                req.user.email,
            so_tien:
                soTien,
            noi_dung:
                noiDung,
            trang_thai:
                'cho_duyet',
            ngay_tao:
                new Date().toISOString()
        };

        data.yeu_cau_nap_tien.push(
            yeuCau
        );

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Đã tạo yêu cầu nạp tiền',
            yeu_cau: yeuCau
        });
    }
);


/* =========================================================
   XEM YÊU CẦU NẠP TIỀN CỦA USER
   ========================================================= */

app.get(
    '/api/nap-tien/yeu-cau',
    auth,
    (req, res) => {

        const data = getDB();

        const list =
            (
                data.yeu_cau_nap_tien ||
                []
            )
            .filter(
                x =>
                    Number(x.user_id) ===
                    Number(req.user.id)
            )
            .sort(
                (a, b) =>
                    new Date(b.ngay_tao) -
                    new Date(a.ngay_tao)
            );

        res.json({
            thanh_cong: true,
            yeu_cau: list
        });
    }
);


/* =========================================================
   NẠP TIỀN TRỰC TIẾP - ADMIN
   ========================================================= */

app.post(
    '/api/nap-tien',
    auth,
    admin,
    (req, res) => {

        const userId =
            Number(req.body.user_id);

        const soTien =
            Number(req.body.so_tien);

        if (
            !Number.isFinite(userId) ||
            !Number.isFinite(soTien) ||
            soTien <= 0
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Thông tin nạp tiền không hợp lệ'
            });
        }

        const data = getDB();

        const user =
            data.users.find(
                u =>
                    Number(u.id) ===
                    userId
            );

        if (!user) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy tài khoản'
            });
        }

        user.so_du += soTien;

        data.lichsu_giao_dich.push({
            id:
                data.nextTransactionId++,
            user_id:
                user.id,
            loai:
                'nap_tien',
            so_tien:
                soTien,
            noi_dung:
                'Admin nạp tiền',
            thoi_gian:
                new Date().toISOString()
        });

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Nạp tiền thành công',
            so_du_moi:
                user.so_du
        });
    }
);


/* =========================================================
   TẠO ĐƠN HÀNG
   ========================================================= */

app.post(
    '/api/don-hang',
    auth,
    (req, res) => {

        try {

            const service =
                timDichVu(
         req.body.dich_vu_id ||
        req.body.dich_vu ||
        req.body.service_id ||
        req.body.ma_dich_vu
                );

            const quantity =
                Number(
                    req.body.so_luong
                );

            const link =
                String(
                    req.body.link || ''
                ).trim();

            const ghiChu =
                String(
                    req.body.ghi_chu || ''
                ).trim();

            if (!service) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Dịch vụ không tồn tại'
                });
            }

            if (!service.hoat_dong) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Dịch vụ này hiện chưa mở bán'
                });
            }

            if (
                !Number.isFinite(quantity) ||
                quantity < service.min ||
                quantity > service.max
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        `Số lượng phải từ ${service.min} đến ${service.max}`
                });
            }

            if (!link) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Vui lòng nhập link'
                });
            }

            const data = getDB();

            const user =
                data.users.find(
                    u =>
                        Number(u.id) ===
                        Number(req.user.id)
                );

            if (!user) {
                return res.status(404).json({
                    thanh_cong: false,
                    message:
                        'Không tìm thấy tài khoản'
                });
            }

            const gia =
                tinhGia(
                    service,
                    quantity
                );

            if (
                !Number.isFinite(gia) ||
                gia <= 0
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Giá dịch vụ chưa được thiết lập'
                });
            }

            if (
                Number(user.so_du) < gia
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Số dư không đủ',
                    so_du:
                        user.so_du,
                    can_thanh_toan:
                        gia
                });
            }

            user.so_du -= gia;

            const ma =
                taoMaDon();

            const donHang = {
                id:
                    data.nextOrderId++,
                ma,
                user_id:
                    user.id,
                email:
                    user.email,
                dich_vu_id:
                    service.id,
                danh_muc:
                    service.danh_muc,
                ten_dich_vu:
                    service.ten,
                so_luong:
                    quantity,
                link,
                ghi_chu:
                    ghiChu,
                gia,
                trang_thai:
                    'cho_xac_nhan',
                ngay_tao:
                    new Date().toISOString()
            };

            data.donhang.push(
                donHang
            );

            data.lichsu_giao_dich.push({
                id:
                    data.nextTransactionId++,
                user_id:
                    user.id,
                loai:
                    'thanh_toan_don_hang',
                so_tien:
                    -gia,
                noi_dung:
                    `Thanh toán đơn ${ma}`,
                thoi_gian:
                    new Date().toISOString()
            });

            saveDB();

            res.json({
                thanh_cong: true,
                message:
                    'Đặt hàng thành công',
                don_hang:
                    donHang,
                so_du_con_lai:
                    user.so_du
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                thanh_cong: false,
                message:
                    'Không thể tạo đơn hàng'
            });
        }
    }
);


/* =========================================================
   XEM ĐƠN HÀNG
   ========================================================= */

app.get(
    '/api/don-hang',
    auth,
    (req, res) => {

        const data = getDB();

        if (
            Number(req.user.la_admin) === 1
        ) {
            return res.json({
                thanh_cong: true,
                don_hang:
                    data.donhang
            });
        }

        const donHang =
            data.donhang
                .filter(
                    x =>
                        Number(x.user_id) ===
                        Number(req.user.id)
                )
                .sort(
                    (a, b) =>
                        new Date(b.ngay_tao) -
                        new Date(a.ngay_tao)
                );

        res.json({
            thanh_cong: true,
            don_hang:
                donHang
        });
    }
);


/* =========================================================
   CẬP NHẬT TRẠNG THÁI ĐƠN - ADMIN
   ========================================================= */

app.put(
    '/api/don-hang/:ma/trang-thai',
    auth,
    admin,
    (req, res) => {

        const hopLe = [
            'cho_xac_nhan',
            'dang_xu_ly',
            'hoan_thanh',
            'da_huy'
        ];

        const trangThai =
            req.body.trang_thai;

        if (
            !hopLe.includes(
                trangThai
            )
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Trạng thái không hợp lệ'
            });
        }

        const data = getDB();

        const order =
            data.donhang.find(
                x =>
                    x.ma ===
                    req.params.ma
            );

        if (!order) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy đơn hàng'
            });
        }

        order.trang_thai =
            trangThai;

        order.cap_nhat =
            new Date().toISOString();

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Đã cập nhật trạng thái',
            don_hang:
                order
        });
    }
);


/* =========================================================
   ADMIN - USERS
   ========================================================= */

app.get(
    '/api/admin/users',
    auth,
    admin,
    (req, res) => {

        const users =
            getDB().users.map(
                user => ({
                    id:
                        user.id,
                    email:
                        user.email,
                    so_du:
                        user.so_du,
                    coin:
                        Number(user.coin || 0),
                    la_admin:
                        user.la_admin,
                    ngay_tao:
                        user.ngay_tao
                })
            );

        res.json({
            thanh_cong: true,
            users
        });
    }
);


/* =========================================================
   ADMIN - GIAO DỊCH
   ========================================================= */

app.get(
    '/api/admin/giao-dich',
    auth,
    admin,
    (req, res) => {

        const giaoDich =
            getDB()
                .lichsu_giao_dich
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.thoi_gian) -
                        new Date(a.thoi_gian)
                );

        res.json({
            thanh_cong: true,
            giao_dich:
                giaoDich
        });
    }
);


/* =========================================================
   ADMIN - YÊU CẦU NẠP TIỀN
   ========================================================= */

app.get(
    '/api/admin/nap-tien',
    auth,
    admin,
    (req, res) => {

        const data = getDB();

        const yeuCau =
            (
                data.yeu_cau_nap_tien ||
                []
            )
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.ngay_tao) -
                    new Date(a.ngay_tao)
            );

        res.json({
            thanh_cong: true,
            yeu_cau:
                yeuCau
        });
    }
);


/* =========================================================
   ADMIN - DUYỆT NẠP TIỀN
   ========================================================= */

app.put(
    '/api/admin/nap-tien/:id',
    auth,
    admin,
    (req, res) => {

        const id =
            Number(req.params.id);

        const trangThai =
            req.body.trang_thai;

        if (
            ![
                'da_duyet',
                'tu_choi'
            ].includes(trangThai)
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Trạng thái không hợp lệ'
            });
        }

        const data = getDB();

        const request =
            (
                data.yeu_cau_nap_tien ||
                []
            ).find(
                x =>
                    Number(x.id) === id
            );

        if (!request) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy yêu cầu'
            });
        }

        if (
            request.trang_thai !==
            'cho_duyet'
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Yêu cầu này đã được xử lý'
            });
        }

        request.trang_thai =
            trangThai;

        request.ngay_xu_ly =
            new Date().toISOString();

        request.admin_id =
            Number(req.user.id);

        if (
            trangThai === 'da_duyet'
        ) {

            const user =
                data.users.find(
                    u =>
                        Number(u.id) ===
                        Number(request.user_id)
                );

            if (!user) {
                return res.status(404).json({
                    thanh_cong: false,
                    message:
                        'Không tìm thấy tài khoản'
                });
            }

            user.so_du +=
                Number(request.so_tien);

            data.lichsu_giao_dich.push({
                id:
                    data.nextTransactionId++,
                user_id:
                    user.id,
                loai:
                    'nap_tien',
                so_tien:
                    Number(request.so_tien),
                noi_dung:
                    'Duyệt yêu cầu nạp tiền #' +
                    request.id,
                thoi_gian:
                    new Date().toISOString()
            });
        }

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                trangThai === 'da_duyet'
                    ? 'Đã duyệt nạp tiền'
                    : 'Đã từ chối nạp tiền',
            yeu_cau:
                request
        });
    }
);


/* =========================================================
   ADMIN - CỘNG TIỀN
   ========================================================= */

app.put(
    '/api/admin/users/:id/cong-tien',
    auth,
    admin,
    (req, res) => {

        const userId =
            Number(req.params.id);

        const soTien =
            Number(req.body.so_tien);

        const lyDo =
            String(
                req.body.ly_do ||
                'Admin cộng tiền'
            ).trim();

        if (
            !Number.isFinite(soTien) ||
            soTien <= 0
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Số tiền không hợp lệ'
            });
        }

        const data = getDB();

        const user =
            data.users.find(
                u =>
                    Number(u.id) ===
                    userId
            );

        if (!user) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy tài khoản'
            });
        }

        user.so_du +=
            soTien;

        data.lichsu_giao_dich.push({
            id:
                data.nextTransactionId++,
            user_id:
                user.id,
            loai:
                'admin_cong_tien',
            so_tien:
                soTien,
            noi_dung:
                lyDo,
            thoi_gian:
                new Date().toISOString()
        });

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Đã cộng tiền',
            so_du:
                user.so_du
        });
    }
);


/* =========================================================
   ADMIN - TRỪ TIỀN
   ========================================================= */

app.put(
    '/api/admin/users/:id/tru-tien',
    auth,
    admin,
    (req, res) => {

        const userId =
            Number(req.params.id);

        const soTien =
            Number(req.body.so_tien);

        const lyDo =
            String(
                req.body.ly_do ||
                'Admin trừ tiền'
            ).trim();

        if (
            !Number.isFinite(soTien) ||
            soTien <= 0
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Số tiền không hợp lệ'
            });
        }

        const data = getDB();

        const user =
            data.users.find(
                u =>
                    Number(u.id) ===
                    userId
            );

        if (!user) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy tài khoản'
            });
        }

        if (
            Number(user.so_du) <
            soTien
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Số dư tài khoản không đủ'
            });
        }

        user.so_du -=
            soTien;

        data.lichsu_giao_dich.push({
            id:
                data.nextTransactionId++,
            user_id:
                user.id,
            loai:
                'admin_tru_tien',
            so_tien:
                -soTien,
            noi_dung:
                lyDo,
            thoi_gian:
                new Date().toISOString()
        });

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Đã trừ tiền',
            so_du:
                user.so_du
        });
    }
);


/* =========================================================
   ADMIN - CỘNG COIN COLOR DICE
   ========================================================= */

app.put(
    '/api/admin/users/:id/cong-coin',
    auth,
    admin,
    (req, res) => {

        const userId =
            Number(req.params.id);

        const soCoin =
            Number(req.body.so_coin);

        const lyDo =
            String(
                req.body.ly_do ||
                'Admin cấp Coin'
            ).trim();

        if (
            !Number.isInteger(soCoin) ||
            soCoin <= 0
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Số Coin không hợp lệ'
            });
        }

        const data = getDB();

        const user =
            data.users.find(
                u =>
                    Number(u.id) ===
                    userId
            );

        if (!user) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy tài khoản'
            });
        }

        if (typeof user.coin !== 'number') {
            user.coin = 0;
        }

        user.coin += soCoin;

        if (!Array.isArray(data.lichsu_giao_dich)) {
            data.lichsu_giao_dich = [];
        }

        data.lichsu_giao_dich.push({
            id:
                data.nextTransactionId++,
            user_id:
                user.id,
            loai:
                'admin_cong_coin',
            so_tien:
                soCoin,
            noi_dung:
                lyDo,
            thoi_gian:
                new Date().toISOString()
        });

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Đã cấp Coin',
            coin:
                user.coin
        });
    }
);


/* =========================================================
   ADMIN - TRỪ COIN COLOR DICE
   ========================================================= */

app.put(
    '/api/admin/users/:id/tru-coin',
    auth,
    admin,
    (req, res) => {

        const userId =
            Number(req.params.id);

        const soCoin =
            Number(req.body.so_coin);

        const lyDo =
            String(
                req.body.ly_do ||
                'Admin trừ Coin'
            ).trim();

        if (
            !Number.isInteger(soCoin) ||
            soCoin <= 0
        ) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Số Coin không hợp lệ'
            });
        }

        const data = getDB();

        const user =
            data.users.find(
                u =>
                    Number(u.id) ===
                    userId
            );

        if (!user) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy tài khoản'
            });
        }

        if (typeof user.coin !== 'number') {
            user.coin = 0;
        }

        if (user.coin < soCoin) {
            return res.status(400).json({
                thanh_cong: false,
                message:
                    'Coin của tài khoản không đủ'
            });
        }

        user.coin -= soCoin;

        if (!Array.isArray(data.lichsu_giao_dich)) {
            data.lichsu_giao_dich = [];
        }

        data.lichsu_giao_dich.push({
            id:
                data.nextTransactionId++,
            user_id:
                user.id,
            loai:
                'admin_tru_coin',
            so_tien:
                -soCoin,
            noi_dung:
                lyDo,
            thoi_gian:
                new Date().toISOString()
        });

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Đã trừ Coin',
            coin:
                user.coin
        });
    }
);


/* =========================================================
   ADMIN - DANH SÁCH DỊCH VỤ
   ========================================================= */

app.get(
    '/api/admin/dich-vu',
    auth,
    admin,
    (req, res) => {

        res.json({
            thanh_cong: true,
            dich_vu:
                DICH_VU
        });
    }
);


/* =========================================================
   ADMIN - CẬP NHẬT DỊCH VỤ
   ========================================================= */

app.put(
    '/api/admin/dich-vu/:id',
    auth,
    admin,
    (req, res) => {

        const service =
            timDichVu(
                req.params.id
            );

        if (!service) {
            return res.status(404).json({
                thanh_cong: false,
                message:
                    'Không tìm thấy dịch vụ'
            });
        }

        if (
            req.body.gia !== undefined
        ) {
            const gia =
                Number(req.body.gia);

            if (
                !Number.isFinite(gia) ||
                gia < 0
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Giá không hợp lệ'
                });
            }

            service.gia =
                gia;
        }

        if (
            req.body.min !== undefined
        ) {
            const min =
                Number(req.body.min);

            if (
                !Number.isFinite(min) ||
                min < 1
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Min không hợp lệ'
                });
            }

            service.min =
                min;
        }

        if (
            req.body.max !== undefined
        ) {
            const max =
                Number(req.body.max);

            if (
                !Number.isFinite(max) ||
                max < service.min
            ) {
                return res.status(400).json({
                    thanh_cong: false,
                    message:
                        'Max không hợp lệ'
                });
            }

            service.max =
                max;
        }

        if (
            req.body.hoat_dong !== undefined
        ) {
            service.hoat_dong =
                Boolean(
                    req.body.hoat_dong
                );
        }

        saveDB();

        res.json({
            thanh_cong: true,
            message:
                'Đã cập nhật dịch vụ',
            dich_vu:
                service
        });
    }
);


/* =========================================================
   ADMIN - THỐNG KÊ
   ========================================================= */

app.get(
    '/api/admin/thong-ke',
    auth,
    admin,
    (req, res) => {

        const data = getDB();

        const tongNguoiDung =
            data.users.length;

        const tongDonHang =
            data.donhang.length;

        const tongDoanhThu =
            data.donhang.reduce(
                (sum, order) =>
                    sum +
                    Number(order.gia || 0),
                0
            );

        const tongSoDu =
            data.users.reduce(
                (sum, user) =>
                    sum +
                    Number(user.so_du || 0),
                0
            );

        const choDuyetNap =
            (
                data.yeu_cau_nap_tien ||
                []
            ).filter(
                x =>
                    x.trang_thai ===
                    'cho_duyet'
            ).length;

        res.json({
            thanh_cong: true,
            thong_ke: {
                tong_nguoi_dung:
                    tongNguoiDung,
                tong_don_hang:
                    tongDonHang,
                tong_doanh_thu:
                    tongDoanhThu,
                tong_so_du:
                    tongSoDu,
                yeu_cau_nap_cho_duyet:
                    choDuyetNap
            }
        });
    }
);


/* =========================================================
   TẠO ADMIN
   ========================================================= */

async function ensureAdmin() {

    const data =
        getDB();

    if (
        !Array.isArray(
            data.users
        )
    ) {
        data.users = [];
    }

    if (
        !Array.isArray(
            data.donhang
        )
    ) {
        data.donhang = [];
    }

    if (
        !Array.isArray(
            data.lichsu_giao_dich
        )
    ) {
        data.lichsu_giao_dich = [];
    }

    if (
        !Array.isArray(
            data.yeu_cau_nap_tien
        )
    ) {
        data.yeu_cau_nap_tien = [];
    }

    if (
        !data.nextUserId
    ) {
        data.nextUserId =
            data.users.length + 1;
    }

    if (
        !data.nextOrderId
    ) {
        data.nextOrderId =
            data.donhang.length + 1;
    }

    if (
        !data.nextTransactionId
    ) {
        data.nextTransactionId =
            data.lichsu_giao_dich.length + 1;
    }

    if (
        !data.nextDepositId
    ) {
        data.nextDepositId =
            data.yeu_cau_nap_tien.length + 1;
    }
data.users.forEach(user => {
    if (typeof user.coin !== 'number') {
        user.coin = 1000;
    }
});
    const exists =
        data.users.find(
            user =>
                user.email ===
                ADMIN_EMAIL
        );

    if (exists) {

        exists.la_admin = 1;

        console.log(
            '✅ Tài khoản Admin đã tồn tại'
        );

        saveDB();

        return;
    }

    const passwordHash =
        await bcrypt.hash(
            ADMIN_PASSWORD,
            10
        );

    data.users.push({
        id:
            data.nextUserId++,
        email:
            ADMIN_EMAIL,
        password:
            passwordHash,
        so_du: 0,
        la_admin: 1,
        ngay_tao:
            new Date().toISOString()
    });

    saveDB();

    console.log(
        '✅ Đã tạo tài khoản Admin'
    );

    console.log(
        '📧 Email: admin@poghazi.com'
    );

    console.log(
        '🔑 Mật khẩu: admin123456'
    );
}






// ================================
// COLOR DICE - ROLL
// ================================

app.post('/api/color-dice/roll', auth, (req, res) => {
    try {
        const { color, bet } = req.body;

        const colors = ['do', 'xanh_la', 'xanh_duong', 'vang', 'tim', 'cam'];

        if (!colors.includes(color)) {
            return res.status(400).json({
                thanh_cong: false,
                thong_bao: 'Màu không hợp lệ'
            });
        }

        const cuoc = Number(bet);

        if (!Number.isInteger(cuoc) || cuoc <= 0) {
            return res.status(400).json({
                thanh_cong: false,
                thong_bao: 'Số Coin cược không hợp lệ'
            });
        }

        const data = getDB();

        const user = data.users.find(
            u => u.id === req.user.id
        );

        if (!user) {
            return res.status(404).json({
                thanh_cong: false,
                thong_bao: 'Không tìm thấy tài khoản'
            });
        }

        if (typeof user.coin !== 'number') {
            user.coin = 1000;
        }

        if (user.coin < cuoc) {
            return res.status(400).json({
                thanh_cong: false,
                thong_bao: 'Không đủ Coin'
            });
        }

        // Trừ cược trước
        user.coin -= cuoc;

        // Roll 4 xúc xắc
        const ketQua = [];

        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(
                Math.random() * colors.length
            );

            ketQua.push(colors[randomIndex]);
        }

        // Đếm số viên đúng màu người chơi chọn
        const soDung = ketQua.filter(
            c => c === color
        ).length;

        // Luật payout:
        // 0 đúng  -> 0x
        // 1 đúng  -> 2x
        // 2 đúng  -> 1x
        // 3 đúng  -> 2x
        // 4 đúng  -> 2x

        let heSo = 0;

        if (soDung === 1) {
            heSo = 2;
        } else if (soDung === 2) {
            heSo = 1;
        } else if (soDung === 3 || soDung === 4) {
            heSo = 2;
        }

        const nhanDuoc = cuoc * heSo;

        user.coin += nhanDuoc;

        if (!Array.isArray(data.lichsu_color_dice)) {
            data.lichsu_color_dice = [];
        }

        data.lichsu_color_dice.push({
            id: data.lichsu_color_dice.length + 1,
            user_id: user.id,
            email: user.email,
            mau_chon: color,
            ket_qua: ketQua,
            so_mau_dung: soDung,
            tien_cuoc: cuoc,
            he_so: heSo,
            coin_nhan: nhanDuoc,
            coin_con_lai: user.coin,
            thoi_gian: new Date().toISOString()
        });

        saveDB();

        return res.json({
            thanh_cong: true,
            mau_chon: color,
            ket_qua: ketQua,
            so_mau_dung: soDung,
            tien_cuoc: cuoc,
            he_so: heSo,
            coin_nhan: nhanDuoc,
            coin: user.coin
        });

    } catch (error) {
        console.error('Lỗi Color Dice:', error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: 'Lỗi máy chủ'
        });
    }
});

// ================================
// COLOR DICE - LỊCH SỬ
// ================================

app.get('/api/color-dice/history', auth, (req, res) => {
    try {
        const data = getDB();

        if (!Array.isArray(data.lichsu_color_dice)) {
            data.lichsu_color_dice = [];
        }

        const lichSu = data.lichsu_color_dice
            .filter(x => x.user_id === req.user.id)
            .slice(-30)
            .reverse();

        return res.json({
            thanh_cong: true,
            lich_su: lichSu
        });

    } catch (error) {
        console.error('Lỗi lấy lịch sử Color Dice:', error);

        return res.status(500).json({
            thanh_cong: false,
            thong_bao: 'Lỗi máy chủ'
        });
    }
});


/* =========================================================
   XỬ LÝ LỖI
   ========================================================= */

app.use(
    (req, res) => {
        res.status(404).json({
            thanh_cong: false,
            message:
                'API không tồn tại'
        });
    }
);


/* =========================================================
   KHỞI ĐỘNG SERVER
   ========================================================= */

async function startServer() {

    await ensureAdmin();

    app.listen(
        PORT,
        () => {

            console.log('');
            console.log(
                '================================'
            );
            console.log(
                '        POGHAZI SERVER'
            );
            console.log(
                '================================'
            );
            console.log(
                '✅ Server: http://localhost:3000'
            );
            console.log(
                '================================'
            );
            console.log('');
        }
    );
}

startServer();
