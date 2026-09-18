const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
                coin: user.coin ?? 0,
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



// ================================
// POGHAZI XO SO 00-99
// ================================

const XO_SO_CHU_KY = 20 * 60 * 1000;
const XO_SO_MO_CUOC = 5 * 60 * 1000;
const XO_SO_XO = 10 * 60 * 1000;
const XO_SO_KIEM_TRA = 15 * 60 * 1000;

const XO_SO_TRAM = [
    'toiyeuVietNam1',
    'toiyeuVietNam2',
    'toiyeuVietNam3'
];

function xoSoRoundStart(ms = Date.now()) {
    return Math.floor(ms / XO_SO_CHU_KY) * XO_SO_CHU_KY;
}

function tao18SoXoSo() {

    const ketQua = [];

    for (let i = 0; i < 18; i++) {

        const so =
            crypto.randomInt(0, 100)
                .toString()
                .padStart(2, '0');

        ketQua.push(so);
    }

    return ketQua;
}

function taoKyXoSo(roundStart) {

    return {
        id: "XS" + roundStart,

        bat_dau:
            new Date(roundStart).toISOString(),

        ket_thuc:
            new Date(
                roundStart + XO_SO_CHU_KY
            ).toISOString(),

        ket_qua: {
            toiyeuVietNam1: tao18SoXoSo(),
            toiyeuVietNam2: tao18SoXoSo(),
            toiyeuVietNam3: tao18SoXoSo()
        },

        ngay_tao:
            new Date().toISOString()
    };
}

function ensureLotteryRound() {

    const data = getDB();

    if (!Array.isArray(data.xo_so_ky)) {
        data.xo_so_ky = [];
    }

    if (!Array.isArray(data.xo_so_cuoc)) {
        data.xo_so_cuoc = [];
    }

    const start = xoSoRoundStart();

    let ky =
        data.xo_so_ky.find(
            x =>
                Number(
                    new Date(x.bat_dau).getTime()
                ) === start
        );

    if (!ky) {

        ky = taoKyXoSo(start);

        data.xo_so_ky.push(ky);

        // Chỉ giữ 100 kỳ gần nhất
        if (data.xo_so_ky.length > 100) {
            data.xo_so_ky =
                data.xo_so_ky.slice(-100);
        }

        saveDB();
    }

    return ky;
}

function xoSoPhase(ky) {

    const start =
        new Date(ky.bat_dau).getTime();

    const elapsed =
        Date.now() - start;

    if (elapsed < XO_SO_MO_CUOC) {

        return {
            phase: "mo_cuoc",
            text: "🟢 Đang mở cược",
            so_da_mo: 0,
            con_lai:
                XO_SO_MO_CUOC - elapsed
        };
    }

    if (elapsed < XO_SO_KIEM_TRA) {

        const elapsedXo =
            elapsed - XO_SO_MO_CUOC;

        const moiSo =
            XO_SO_XO / 18;

        const soDaMo =
            Math.min(
                18,
                Math.max(
                    0,
                    Math.floor(elapsedXo / moiSo) + 1
                )
            );

        return {
            phase: "dang_xo",
            text: "🎰 Đang xổ",
            so_da_mo: soDaMo,
            con_lai:
                XO_SO_KIEM_TRA - elapsed
        };
    }

    return {
        phase: "kiem_tra",
        text: "📋 Kiểm tra kết quả",
        so_da_mo: 18,
        con_lai:
            XO_SO_CHU_KY - elapsed
    };
}

function ketQuaAnTheoPhase(ky, soDaMo) {

    const result = {};

    XO_SO_TRAM.forEach(tram => {

        result[tram] =
            ky.ket_qua[tram].map(
                (so, index) =>
                    index < soDaMo
                        ? so
                        : null
            );
    });

    return result;
}

function demSoLanXuatHien(ky, so) {

    let count = 0;

    XO_SO_TRAM.forEach(tram => {

        const list =
            ky.ket_qua[tram] || [];

        count +=
            list.filter(
                x => x === so
            ).length;
    });

    return count;
}

function heSoXoSo(soLan) {

    if (soLan <= 0) return 0;

    if (soLan === 1) return 1;
    if (soLan === 2) return 2;
    if (soLan === 3) return 3;

    return 4;
}

function settleLottery() {

    const data = getDB();

    if (!Array.isArray(data.xo_so_ky)) {
        data.xo_so_ky = [];
    }

    if (!Array.isArray(data.xo_so_cuoc)) {
        data.xo_so_cuoc = [];
    }

    let changed = false;

    for (const bet of data.xo_so_cuoc) {

        if (bet.da_thanh_toan) {
            continue;
        }

        const ky =
            data.xo_so_ky.find(
                x => x.id === bet.ky_id
            );

        if (!ky) {
            continue;
        }

        const start =
            new Date(
                ky.bat_dau
            ).getTime();

        if (
            Date.now() <
            start + XO_SO_KIEM_TRA
        ) {
            continue;
        }

        const user =
            data.users.find(
                u => u.id === bet.user_id
            );

        if (!user) {
            bet.da_thanh_toan = true;
            bet.trang_thai = "loi_tai_khoan";
            changed = true;
            continue;
        }

        if (typeof user.coin !== "number") {
            user.coin = 1000;
        }

        const soLan =
            demSoLanXuatHien(
                ky,
                bet.so
            );

        const heSo =
            heSoXoSo(soLan);

        const coinNhan =
            Number(bet.tien_cuoc) * heSo;

        user.coin += coinNhan;

        bet.so_lan_trung = soLan;
        bet.he_so = heSo;
        bet.coin_nhan = coinNhan;
        bet.coin_sau = user.coin;
        bet.da_thanh_toan = true;

        if (soLan === 0) {
            bet.trang_thai = "thua";
        } else if (soLan === 1) {
            bet.trang_thai = "hoa_von";
        } else {
            bet.trang_thai = "thang";
        }

        bet.thoi_gian_thanh_toan =
            new Date().toISOString();

        if (!Array.isArray(data.lichsu_giao_dich)) {
            data.lichsu_giao_dich = [];
        }

        data.lichsu_giao_dich.push({
            id:
                data.lichsu_giao_dich.length + 1,

            user_id:
                user.id,

            loai:
                "xo_so",

            so_tien:
                coinNhan,

            noi_dung:
                coinNhan > 0
                    ? `Xổ số ${bet.so} - trúng ${soLan} lần - nhận ${coinNhan} Coin`
                    : `Xổ số ${bet.so} - không trúng`,

            ngay_tao:
                new Date().toISOString()
        });

        changed = true;
    }

    if (changed) {
        saveDB();
    }
}

function khoiDongXoSo() {

    ensureLotteryRound();
    settleLottery();

    setInterval(() => {

        try {

            ensureLotteryRound();
            settleLottery();

        } catch (error) {

            console.error(
                "Lỗi hệ thống Xổ Số:",
                error
            );
        }

    }, 5000);
}


// ================================
// API XỔ SỐ - TRẠNG THÁI
// ================================

app.get(
    '/api/xo-so/trang-thai',
    auth,
    (req, res) => {

        try {

            const ky =
                ensureLotteryRound();

            settleLottery();

            const phase =
                xoSoPhase(ky);

            const data =
                getDB();

            const user =
                data.users.find(
                    u => u.id === req.user.id
                );

            const cuoc =
                data.xo_so_cuoc
                    .filter(
                        x =>
                            x.ky_id === ky.id &&
                            x.user_id === req.user.id
                    )
                    .slice(-1)[0] || null;

            return res.json({

                thanh_cong: true,

                ky_id:
                    ky.id,

                bat_dau:
                    ky.bat_dau,

                ket_thuc:
                    ky.ket_thuc,

                phase:
                    phase.phase,

                phase_text:
                    phase.text,

                thoi_gian_con_lai_ms:
                    Math.max(
                        0,
                        phase.con_lai
                    ),

                so_da_mo:
                    phase.so_da_mo,

                ket_qua:
                    ketQuaAnTheoPhase(
                        ky,
                        phase.so_da_mo
                    ),

                cuoc_cua_toi:
                    cuoc,

                coin:
                    Number(
                        user?.coin || 0
                    )
            });

        } catch (error) {

            console.error(
                "Lỗi trạng thái Xổ Số:",
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao: "Lỗi máy chủ"
            });
        }
    }
);


// ================================
// API XỔ SỐ - ĐẶT CƯỢC
// ================================

app.post(
    '/api/xo-so/dat-cuoc',
    auth,
    (req, res) => {

        try {

            const so =
                String(
                    req.body.so ?? ""
                )
                .trim()
                .padStart(2, "0");

            const coin =
                Number(
                    req.body.coin
                );

            if (
                !/^\d{2}$/.test(so) ||
                Number(so) < 0 ||
                Number(so) > 99
            ) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        "Số cược phải từ 00 đến 99"
                });
            }

            if (
                !Number.isInteger(coin) ||
                coin <= 0
            ) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        "Số Coin cược không hợp lệ"
                });
            }

            const ky =
                ensureLotteryRound();

            const phase =
                xoSoPhase(ky);

            if (
                phase.phase !== "mo_cuoc"
            ) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        "Đã hết thời gian đặt cược cho kỳ này"
                });
            }

            const data =
                getDB();

            const user =
                data.users.find(
                    u => u.id === req.user.id
                );

            if (!user) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        "Không tìm thấy tài khoản"
                });
            }

            if (typeof user.coin !== "number") {
                user.coin = 1000;
            }

            if (user.coin < coin) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        "Không đủ Coin"
                });
            }

            const daDat =
                data.xo_so_cuoc.some(
                    x =>
                        x.ky_id === ky.id &&
                        x.user_id === user.id
                );

            if (daDat) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        "Bạn đã đặt cược kỳ này rồi"
                });
            }

            user.coin -= coin;

            const bet = {

                id:
                    data.xo_so_cuoc.length + 1,

                ky_id:
                    ky.id,

                user_id:
                    user.id,

                email:
                    user.email,

                so,

                tien_cuoc:
                    coin,

                trang_thai:
                    "dang_cho",

                so_lan_trung:
                    null,

                he_so:
                    null,

                coin_nhan:
                    0,

                coin_sau_dat:
                    user.coin,

                da_thanh_toan:
                    false,

                ngay_dat:
                    new Date().toISOString(),

                thoi_gian_thanh_toan:
                    null
            };

            data.xo_so_cuoc.push(bet);

            if (!Array.isArray(data.lichsu_giao_dich)) {
                data.lichsu_giao_dich = [];
            }

            data.lichsu_giao_dich.push({

                id:
                    data.lichsu_giao_dich.length + 1,

                user_id:
                    user.id,

                loai:
                    "cuoc_xo_so",

                so_tien:
                    -coin,

                noi_dung:
                    `Đặt Xổ Số số ${so}`,

                ngay_tao:
                    new Date().toISOString()
            });

            saveDB();

            return res.json({

                thanh_cong: true,

                thong_bao:
                    `Đã đặt ${coin} Coin vào số ${so}`,

                so,

                tien_cuoc:
                    coin,

                coin:
                    user.coin,

                ky_id:
                    ky.id
            });

        } catch (error) {

            console.error(
                "Lỗi đặt Xổ Số:",
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    "Lỗi máy chủ"
            });
        }
    }
);


// ================================
// API XỔ SỐ - LỊCH SỬ
// ================================

app.get(
    '/api/xo-so/lich-su',
    auth,
    (req, res) => {

        try {

            settleLottery();

            const data =
                getDB();

            const history =
                (data.xo_so_cuoc || [])
                    .filter(
                        x =>
                            x.user_id === req.user.id
                    )
                    .slice(-30)
                    .reverse()
                    .map(item => {

                        const ky =
                            (data.xo_so_ky || [])
                                .find(
                                    x =>
                                        x.id === item.ky_id
                                );

                        return {

                            ...item,

                            ket_qua:
                                ky
                                    ? ky.ket_qua
                                    : null
                        };
                    });

            return res.json({

                thanh_cong: true,

                lich_su:
                    history

            });

        } catch (error) {

            console.error(
                "Lỗi lịch sử Xổ Số:",
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    "Lỗi máy chủ"
            });
        }
    }
);



/* =========================================================
   POGHAZI PVP - COLOR BATTLE
   Coin ảo - không quy đổi tiền thật
   ========================================================= */

const PVP_COLORS = [
    'do',
    'xanh_la',
    'xanh_duong',
    'vang',
    'tim',
    'cam'
];

const PVP_BET_MIN = 10;
const PVP_BET_MAX = 1000000;
const PVP_DICE_COUNT = 4;


/* =========================
   KHỞI TẠO DỮ LIỆU PVP
   ========================= */

function ensurePvPData(data) {

    if (!Array.isArray(data.pvp_phong)) {
        data.pvp_phong = [];
    }

    if (!Array.isArray(data.lichsu_pvp)) {
        data.lichsu_pvp = [];
    }

    if (!Number.isInteger(data.nextPvpRoomId)) {
        data.nextPvpRoomId = 1;
    }

    if (!Number.isInteger(data.nextPvpMatchId)) {
        data.nextPvpMatchId = 1;
    }
}


/* =========================
   TÌM USER
   ========================= */

function timUserPvP(data, userId) {

    return data.users.find(
        u => Number(u.id) === Number(userId)
    );
}


/* =========================
   TẠO MÃ PHÒNG
   ========================= */

function taoMaPhongPvP(data) {

    let ma;

    do {
        ma = crypto
            .randomBytes(3)
            .toString('hex')
            .toUpperCase();

    } while (
        data.pvp_phong.some(
            p => p.ma_phong === ma
        )
    );

    return ma;
}


/* =========================
   ROLL XÚC XẮC
   ========================= */

function rollPvPDice() {

    const ketQua = [];

    for (let i = 0; i < PVP_DICE_COUNT; i++) {

        ketQua.push(
            PVP_COLORS[
                crypto.randomInt(
                    0,
                    PVP_COLORS.length
                )
            ]
        );
    }

    return ketQua;
}


/* =========================
   TÍNH ĐIỂM
   ========================= */

function tinhDiemPvP(dice, mau) {

    return dice.filter(
        x => x === mau
    ).length;
}


/* =========================
   KẾT THÚC TRẬN
   ========================= */

function xuLyKetThucPvP(phong) {

    if (
        ![
            'dang_cho',
            'dang_cho_ket_qua'
        ].includes(phong.trang_thai)
    ) {
        return phong;
    }

    if (
        !phong.nguoi_choi_1 ||
        !phong.nguoi_choi_2
    ) {
        return phong;
    }

    const data = getDB();

    ensurePvPData(data);

    const p1 = timUserPvP(
        data,
        phong.nguoi_choi_1.user_id
    );

    const p2 = timUserPvP(
        data,
        phong.nguoi_choi_2.user_id
    );

    if (!p1 || !p2) {

        phong.trang_thai =
            'loi_tai_khoan';

        phong.ket_qua_text =
            'Không tìm thấy tài khoản người chơi';

        saveDB();

        return phong;
    }

    if (typeof p1.coin !== 'number') {
        p1.coin = 1000;
    }

    if (typeof p2.coin !== 'number') {
        p2.coin = 1000;
    }

    const cuoc =
        Number(phong.tien_cuoc);

    /*
     * HAI NGƯỜI DÙNG CHUNG MỘT LẦN ROLL.
     *
     * Nếu hòa -> tự động roll lại.
     * Không cần người chơi bấm nút.
     */

    let dice = [];
    let diem1 = 0;
    let diem2 = 0;
    let soLanRoll = 0;

    while (true) {

        soLanRoll++;

        dice = rollPvPDice();

        diem1 = tinhDiemPvP(
            dice,
            phong.nguoi_choi_1.mau
        );

        diem2 = tinhDiemPvP(
            dice,
            phong.nguoi_choi_2.mau
        );

        /*
         * Hai người bằng điểm -> roll lại.
         */
        if (diem1 === diem2) {
            continue;
        }

        break;
    }

    let ketQua;
    let nguoiThang;

    let coinNhan1 = 0;
    let coinNhan2 = 0;

    if (diem1 > diem2) {

        ketQua =
            'nguoi_choi_1_thang';

        nguoiThang =
            p1.id;

        coinNhan1 =
            cuoc * 2;

    } else {

        ketQua =
            'nguoi_choi_2_thang';

        nguoiThang =
            p2.id;

        coinNhan2 =
            cuoc * 2;
    }

    /*
     * Chỉ cộng thưởng SAU KHI có người thắng.
     *
     * Hai người đã bị trừ tiền cược lúc tham gia
     * nên người thắng nhận lại tổng tiền cược của
     * cả hai người.
     */

    p1.coin += coinNhan1;
    p2.coin += coinNhan2;

    /*
     * Lưu cùng một bộ xúc xắc cho cả hai người.
     */
    phong.nguoi_choi_1.ket_qua =
        dice;

    phong.nguoi_choi_1.diem =
        diem1;

    phong.nguoi_choi_1.coin_nhan =
        coinNhan1;

    phong.nguoi_choi_2.ket_qua =
        dice;

    phong.nguoi_choi_2.diem =
        diem2;

    phong.nguoi_choi_2.coin_nhan =
        coinNhan2;

    phong.so_lan_roll =
        soLanRoll;

    phong.nguoi_thang =
        nguoiThang;

    phong.ket_qua =
        ketQua;

    phong.trang_thai =
        'da_ket_thuc';

    phong.match_id =
        'PVP' +
        data.nextPvpMatchId++;

    phong.thoi_gian_ket_thuc =
        new Date().toISOString();

    if (!Array.isArray(data.lichsu_giao_dich)) {
        data.lichsu_giao_dich = [];
    }

    const now =
        new Date().toISOString();

    /*
     * Lịch sử giao dịch người chơi 1
     */
    data.lichsu_giao_dich.push({

        id:
            data.lichsu_giao_dich.length + 1,

        user_id:
            p1.id,

        loai:
            'pvp',

        so_tien:
            coinNhan1 - cuoc,

        noi_dung:
            `PvP ${phong.match_id} - ${
                nguoiThang === p1.id
                    ? 'Thắng'
                    : 'Thua'
            }`,

        thoi_gian:
            now
    });

    /*
     * Lịch sử giao dịch người chơi 2
     */
    data.lichsu_giao_dich.push({

        id:
            data.lichsu_giao_dich.length + 1,

        user_id:
            p2.id,

        loai:
            'pvp',

        so_tien:
            coinNhan2 - cuoc,

        noi_dung:
            `PvP ${phong.match_id} - ${
                nguoiThang === p2.id
                    ? 'Thắng'
                    : 'Thua'
            }`,

        thoi_gian:
            now
    });

    /*
     * Lưu lịch sử trận đấu
     */
    data.lichsu_pvp.push({

        id:
            data.lichsu_pvp.length + 1,

        match_id:
            phong.match_id,

        ma_phong:
            phong.ma_phong,

        user1_id:
            p1.id,

        user1_email:
            p1.email,

        user1_mau:
            phong.nguoi_choi_1.mau,

        user1_diem:
            diem1,

        user1_coin_cuoc:
            cuoc,

        user1_coin_nhan:
            coinNhan1,

        user2_id:
            p2.id,

        user2_email:
            p2.email,

        user2_mau:
            phong.nguoi_choi_2.mau,

        user2_diem:
            diem2,

        user2_coin_cuoc:
            cuoc,

        user2_coin_nhan:
            coinNhan2,

        ket_qua:
            ketQua,

        nguoi_thang:
            nguoiThang,

        dice:
            dice,

        so_lan_roll:
            soLanRoll,

        thoi_gian:
            now
    });

    saveDB();

    return phong;
}

/* =========================
   TẠO PHÒNG
   ========================= */

app.post(
    '/api/pvp/tao-phong',
    auth,
    (req, res) => {

        try {

            const mau =
                String(
                    req.body.mau || ''
                ).trim();

            const tienCuoc =
                Number(
                    req.body.tien_cuoc
                );

            if (!PVP_COLORS.includes(mau)) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Màu không hợp lệ'
                });
            }

            if (
                !Number.isInteger(tienCuoc) ||
                tienCuoc < PVP_BET_MIN ||
                tienCuoc > PVP_BET_MAX
            ) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        `Tiền cược phải từ ${PVP_BET_MIN.toLocaleString()} đến ${PVP_BET_MAX.toLocaleString()} Coin`
                });
            }

            const data = getDB();

            ensurePvPData(data);

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            if (!user) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy tài khoản'
                });
            }

            if (typeof user.coin !== 'number') {
                user.coin = 1000;
            }

            if (user.coin < tienCuoc) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không đủ Coin'
                });
            }

            const soPhongDangCho =
                data.pvp_phong.filter(
                    p =>
                        p.trang_thai === 'dang_cho' &&
                        Number(
                            p.nguoi_choi_1?.user_id
                        ) === Number(user.id)
                ).length;

            if (soPhongDangCho >= 10) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Bạn chỉ được tạo tối đa 10 phòng PvP đang chờ'
                });
            }

            user.coin -= tienCuoc;

            const phong = {

                id:
                    data.nextPvpRoomId++,

                ma_phong:
                    taoMaPhongPvP(data),

                tien_cuoc:
                    tienCuoc,

                trang_thai:
                    'dang_cho',

                nguoi_choi_1: {

                    user_id:
                        user.id,

                    email:
                        user.email,

                    mau,

                    ket_qua:
                        null,

                    diem:
                        null,

                    coin_nhan:
                        0
                },

                nguoi_choi_2:
                    null,

                nguoi_thang:
                    null,

                ket_qua:
                    null,

                match_id:
                    null,

                ngay_tao:
                    new Date().toISOString(),

                thoi_gian_ket_thuc:
                    null
            };

            data.pvp_phong.push(phong);

            if (!Array.isArray(data.lichsu_giao_dich)) {
                data.lichsu_giao_dich = [];
            }

            data.lichsu_giao_dich.push({

                id:
                    data.lichsu_giao_dich.length + 1,

                user_id:
                    user.id,

                loai:
                    'pvp_dat_cuoc',

                so_tien:
                    -tienCuoc,

                noi_dung:
                    `Tạo phòng PvP ${phong.ma_phong}`,

                thoi_gian:
                    new Date().toISOString()
            });

            saveDB();

            return res.json({

                thanh_cong:
                    true,

                thong_bao:
                    'Đã tạo phòng PvP',

                phong,

                coin:
                    user.coin

            });

        } catch (error) {

            console.error(
                'Lỗi tạo phòng PvP:',
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   DANH SÁCH PHÒNG
   ========================= */

app.get(
    '/api/pvp/phong',
    auth,
    (req, res) => {

        try {

            const data = getDB();

            ensurePvPData(data);

            const phong =
                data.pvp_phong
                    .filter(
                        p =>
                            p.trang_thai ===
                            'dang_cho'
                    )
                    .slice()
                    .reverse()
                    .map(
                        p => ({

                            id:
                                p.id,

                            ma_phong:
                                p.ma_phong,

                            tien_cuoc:
                                p.tien_cuoc,

                            nguoi_tao:
                                p.nguoi_choi_1?.email ||
                                'Ẩn',

                            mau:
                                p.nguoi_choi_1?.mau,

                            ngay_tao:
                                p.ngay_tao
                        })
                    );

            return res.json({

                thanh_cong:
                    true,

                phong

            });

        } catch (error) {

            console.error(
                'Lỗi danh sách PvP:',
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   THAM GIA PHÒNG
   ========================= */

app.post(
    '/api/pvp/tham-gia',
    auth,
    (req, res) => {

        try {

            const maPhong =
                String(
                    req.body.ma_phong || ''
                )
                .trim()
                .toUpperCase();

            const mau =
                String(
                    req.body.mau || ''
                ).trim();

            if (!maPhong) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Thiếu mã phòng'
                });
            }

            if (!PVP_COLORS.includes(mau)) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Màu không hợp lệ'
                });
            }

            const data = getDB();

            ensurePvPData(data);

            const phong =
                data.pvp_phong.find(
                    p =>
                        p.ma_phong === maPhong
                );

            if (!phong) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy phòng'
                });
            }

            if (phong.trang_thai !== 'dang_cho') {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Phòng này không còn nhận người chơi'
                });
            }

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            if (!user) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy tài khoản'
                });
            }

            if (
                Number(
                    phong.nguoi_choi_1.user_id
                ) === Number(user.id)
            ) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Bạn không thể tham gia phòng của chính mình'
                });
            }

            if (
                phong.nguoi_choi_1.mau === mau
            ) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Hai người chơi phải chọn màu khác nhau'
                });
            }

            if (typeof user.coin !== 'number') {
                user.coin = 1000;
            }

            const tienCuoc =
                Number(
                    phong.tien_cuoc
                );

            if (user.coin < tienCuoc) {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không đủ Coin để tham gia'
                });
            }

            user.coin -= tienCuoc;

            phong.nguoi_choi_2 = {

                user_id:
                    user.id,

                email:
                    user.email,

                mau,

                ket_qua:
                    null,

                diem:
                    null,

                coin_nhan:
                    0
            };

            phong.trang_thai =
                'dang_cho_ket_qua';

            phong.thoi_gian_tham_gia =
                new Date().toISOString();

            if (!Array.isArray(data.lichsu_giao_dich)) {
                data.lichsu_giao_dich = [];
            }

            data.lichsu_giao_dich.push({

                id:
                    data.lichsu_giao_dich.length + 1,

                user_id:
                    user.id,

                loai:
                    'pvp_dat_cuoc',

                so_tien:
                    -tienCuoc,

                noi_dung:
                    `Tham gia phòng PvP ${phong.ma_phong}`,

                thoi_gian:
                    new Date().toISOString()
            });

            xuLyKetThucPvP(phong);

            saveDB();

            return res.json({

                thanh_cong:
                    true,

                thong_bao:
                    'Trận PvP đã bắt đầu',

                phong,

                coin:
                    user.coin

            });

        } catch (error) {

            console.error(
                'Lỗi tham gia PvP:',
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   XEM PHÒNG
   ========================= */

app.get(
    '/api/pvp/phong/:ma',
    auth,
    (req, res) => {

        try {

            const maPhong =
                String(
                    req.params.ma || ''
                )
                .trim()
                .toUpperCase();

            const data = getDB();

            ensurePvPData(data);

            const phong =
                data.pvp_phong.find(
                    p =>
                        p.ma_phong === maPhong
                );

            if (!phong) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy phòng'
                });
            }

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            if (!user) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy tài khoản'
                });
            }

            return res.json({

                thanh_cong:
                    true,

                phong,

                coin:
                    Number(
                        user.coin || 0
                    )

            });

        } catch (error) {

            console.error(
                'Lỗi xem phòng PvP:',
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   HỦY PHÒNG
   ========================= */

app.post(
    '/api/pvp/huy-phong',
    auth,
    (req, res) => {

        try {

            const maPhong =
                String(
                    req.body.ma_phong || ''
                )
                .trim()
                .toUpperCase();

            const data = getDB();

            ensurePvPData(data);

            const phong =
                data.pvp_phong.find(
                    p =>
                        p.ma_phong === maPhong
                );

            if (!phong) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy phòng'
                });
            }

            if (phong.trang_thai !== 'dang_cho') {

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không thể hủy phòng này'
                });
            }

            if (
                Number(
                    phong.nguoi_choi_1.user_id
                ) !== Number(req.user.id)
            ) {

                return res.status(403).json({
                    thanh_cong: false,
                    thong_bao:
                        'Bạn không phải chủ phòng'
                });
            }

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            if (!user) {

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy tài khoản'
                });
            }

            user.coin +=
                Number(
                    phong.tien_cuoc
                );

            phong.trang_thai =
                'da_huy';

            phong.thoi_gian_huy =
                new Date().toISOString();

            phong.ket_qua_text =
                'Chủ phòng đã hủy phòng';

            if (!Array.isArray(data.lichsu_giao_dich)) {
                data.lichsu_giao_dich = [];
            }

            data.lichsu_giao_dich.push({

                id:
                    data.lichsu_giao_dich.length + 1,

                user_id:
                    user.id,

                loai:
                    'pvp_hoan_coin',

                so_tien:
                    Number(
                        phong.tien_cuoc
                    ),

                noi_dung:
                    `Hoàn Coin do hủy phòng ${phong.ma_phong}`,

                thoi_gian:
                    new Date().toISOString()
            });

            saveDB();

            return res.json({

                thanh_cong:
                    true,

                thong_bao:
                    'Đã hủy phòng và hoàn Coin',

                coin:
                    user.coin

            });

        } catch (error) {

            console.error(
                'Lỗi hủy phòng PvP:',
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);




/* =========================================================
   DICE DUEL - 2 NGƯỜI ĐẤU XÚC XẮC
   ========================================================= */

const DICE_DUEL_BET_MIN = 10;
const DICE_DUEL_BET_MAX = 1000000;
const DICE_DUEL_ROLL_COUNT = 3;

function ensureDiceDuelData(data){

    if(!Array.isArray(data.dice_duel_phong)){
        data.dice_duel_phong = [];
    }

    if(!Array.isArray(data.lichsu_dice_duel)){
        data.lichsu_dice_duel = [];
    }

    if(typeof data.nextDiceDuelRoomId !== 'number'){
        data.nextDiceDuelRoomId = 1;
    }
}


function taoMaDiceDuel(data){

    const chars =
        'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let ma;

    do{

        ma = '';

        for(let i = 0; i < 5; i++){
            ma += chars[
                crypto.randomInt(0, chars.length)
            ];
        }

    }while(
        data.dice_duel_phong.some(
            p => p.ma_phong === ma
        )
    );

    return ma;
}


function rollDiceDuel(){

    return [
        crypto.randomInt(1, 7),
        crypto.randomInt(1, 7),
        crypto.randomInt(1, 7)
    ];
}


function danhGiaDiceDuel(dice){

    const a = Number(dice[0]);
    const b = Number(dice[1]);
    const c = Number(dice[2]);

    const boBa =
        a === b &&
        b === c;

    if(boBa){

        return {
            bo_ba: true,
            diem_bo_ba: a,
            tong: a + b + c,
            xep_hang: 2,
            mo_ta: `${a}${b}${c}`
        };
    }

    return {
        bo_ba: false,
        diem_bo_ba: 0,
        tong: a + b + c,
        xep_hang: 1,
        mo_ta: `${a} + ${b} + ${c}`
    };
}


function xacDinhThangDiceDuel(
    dice1,
    dice2
){

    const kq1 =
        danhGiaDiceDuel(dice1);

    const kq2 =
        danhGiaDiceDuel(dice2);

    /*
     * Bộ ba luôn ưu tiên hơn tổng điểm.
     */
    if(kq1.bo_ba && !kq2.bo_ba){
        return {
            ket_qua: 1,
            kq1,
            kq2
        };
    }

    if(!kq1.bo_ba && kq2.bo_ba){
        return {
            ket_qua: 2,
            kq1,
            kq2
        };
    }

    /*
     * Cả hai đều là bộ ba:
     * 666 > 555 > ... > 111
     */
    if(kq1.bo_ba && kq2.bo_ba){

        if(kq1.diem_bo_ba > kq2.diem_bo_ba){
            return {
                ket_qua: 1,
                kq1,
                kq2
            };
        }

        if(kq2.diem_bo_ba > kq1.diem_bo_ba){
            return {
                ket_qua: 2,
                kq1,
                kq2
            };
        }

        return {
            ket_qua: 0,
            kq1,
            kq2
        };
    }

    /*
     * Không có bộ ba:
     * so tổng 3 viên.
     */
    if(kq1.tong > kq2.tong){

        return {
            ket_qua: 1,
            kq1,
            kq2
        };
    }

    if(kq2.tong > kq1.tong){

        return {
            ket_qua: 2,
            kq1,
            kq2
        };
    }

    return {
        ket_qua: 0,
        kq1,
        kq2
    };
}


function xuLyKetThucDiceDuel(phong){

    const data = getDB();

    ensureDiceDuelData(data);

    const cuoc =
        Number(phong.tien_cuoc);

    let lanRoll = 0;
    let dice1;
    let dice2;
    let ketQua;

    /*
     * Hai người cùng đấu trong một lượt.
     *
     * Nếu hòa -> tự động roll lại.
     */
    do{

        lanRoll++;

        dice1 =
            rollDiceDuel();

        dice2 =
            rollDiceDuel();

        ketQua =
            xacDinhThangDiceDuel(
                dice1,
                dice2
            );

    }while(
        ketQua.ket_qua === 0
    );

    const winner =
        ketQua.ket_qua === 1
            ? phong.nguoi_choi_1
            : phong.nguoi_choi_2;

    const loser =
        ketQua.ket_qua === 1
            ? phong.nguoi_choi_2
            : phong.nguoi_choi_1;

    const coinNhan =
        cuoc * 2;

    const userWinner =
        timUserPvP(
            data,
            winner.user_id
        );

    if(userWinner){

        if(typeof userWinner.coin !== 'number'){
            userWinner.coin = 0;
        }

        userWinner.coin += coinNhan;
    }

    phong.trang_thai =
        'da_ket_thuc';

    phong.ket_qua = {
        nguoi_thang:
            winner.user_id,

        nguoi_thua:
            loser.user_id,

        dice_1:
            dice1,

        dice_2:
            dice2,

        diem_1:
            ketQua.kq1.tong,

        diem_2:
            ketQua.kq2.tong,

        bo_ba_1:
            ketQua.kq1.bo_ba,

        bo_ba_2:
            ketQua.kq2.bo_ba,

        gia_tri_bo_ba_1:
            ketQua.kq1.diem_bo_ba,

        gia_tri_bo_ba_2:
            ketQua.kq2.diem_bo_ba,

        so_lan_roll:
            lanRoll,

        coin_thang:
            coinNhan,

        thoi_gian:
            Date.now()
    };

    phong.nguoi_choi_1.coin_nhan =
        ketQua.ket_qua === 1
            ? coinNhan
            : 0;

    phong.nguoi_choi_2.coin_nhan =
        ketQua.ket_qua === 2
            ? coinNhan
            : 0;

    data.lichsu_dice_duel.push({
        id:
            data.nextDiceDuelRoomId++,

        ma_phong:
            phong.ma_phong,

        nguoi_thang:
            winner.user_id,

        nguoi_thua:
            loser.user_id,

        nguoi_choi_1:
            phong.nguoi_choi_1,

        nguoi_choi_2:
            phong.nguoi_choi_2,

        ket_qua:
            phong.ket_qua,

        tien_cuoc:
            cuoc,

        thoi_gian:
            Date.now()
    });

    saveDB();

    return phong;
}


/* =========================
   DICE DUEL - TẠO PHÒNG
   ========================= */

app.post(
    '/api/dice-duel/tao-phong',
    auth,
    (req, res) => {

        try{

            const tienCuoc =
                Number(
                    req.body.tien_cuoc
                );

            if(
                !Number.isInteger(tienCuoc) ||
                tienCuoc < DICE_DUEL_BET_MIN ||
                tienCuoc > DICE_DUEL_BET_MAX
            ){

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        `Tiền cược phải từ ${DICE_DUEL_BET_MIN.toLocaleString()} đến ${DICE_DUEL_BET_MAX.toLocaleString()} Coin`
                });
            }

            const data = getDB();

            ensureDiceDuelData(data);

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            if(!user){

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy tài khoản'
                });
            }

            if(typeof user.coin !== 'number'){
                user.coin = 1000;
            }

            if(user.coin < tienCuoc){

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không đủ Coin'
                });
            }

            /*
             * Trừ tiền cược ngay khi tạo phòng.
             */
            user.coin -= tienCuoc;

            const phong = {

                id:
                    data.nextDiceDuelRoomId++,

                ma_phong:
                    taoMaDiceDuel(data),

                tien_cuoc:
                    tienCuoc,

                trang_thai:
                    'dang_cho',

                nguoi_choi_1: {

                    user_id:
                        user.id,

                    email:
                        user.email,

                    ket_qua:
                        null,

                    diem:
                        null,

                    coin_nhan:
                        0
                },

                nguoi_choi_2:
                    null,

                ket_qua:
                    null,

                thoi_gian:
                    Date.now()
            };

            data.dice_duel_phong.push(
                phong
            );

            saveDB();

            return res.json({

                thanh_cong: true,

                phong,

                coin:
                    user.coin
            });

        }catch(e){

            console.error(
                'Lỗi tạo Dice Duel:',
                e
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   DICE DUEL - PHÒNG ĐANG CHỜ
   ========================= */

app.get(
    '/api/dice-duel/phong',
    auth,
    (req, res) => {

        try{

            const data = getDB();

            ensureDiceDuelData(data);

            const phong =
                data.dice_duel_phong
                    .filter(
                        p =>
                            p.trang_thai ===
                            'dang_cho'
                    )
                    .slice()
                    .reverse();

            return res.json({

                thanh_cong: true,

                phong

            });

        }catch(e){

            console.error(
                'Lỗi tải phòng Dice Duel:',
                e
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   DICE DUEL - THAM GIA
   ========================= */

app.post(
    '/api/dice-duel/tham-gia',
    auth,
    (req, res) => {

        try{

            const maPhong =
                String(
                    req.body.ma_phong || ''
                )
                .trim()
                .toUpperCase();

            if(!maPhong){

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Thiếu mã phòng'
                });
            }

            const data = getDB();

            ensureDiceDuelData(data);

            const phong =
                data.dice_duel_phong.find(
                    p =>
                        p.ma_phong ===
                        maPhong
                );

            if(!phong){

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy phòng'
                });
            }

            if(
                phong.trang_thai !==
                'dang_cho'
            ){

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Phòng không còn chờ'
                });
            }

            if(
                Number(
                    phong.nguoi_choi_1.user_id
                ) ===
                Number(req.user.id)
            ){

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không thể tự tham gia phòng của mình'
                });
            }

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            if(!user){

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy tài khoản'
                });
            }

            if(typeof user.coin !== 'number'){
                user.coin = 1000;
            }

            const cuoc =
                Number(
                    phong.tien_cuoc
                );

            if(user.coin < cuoc){

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không đủ Coin'
                });
            }

            user.coin -= cuoc;

            phong.nguoi_choi_2 = {

                user_id:
                    user.id,

                email:
                    user.email,

                ket_qua:
                    null,

                diem:
                    null,

                coin_nhan:
                    0
            };

            phong.trang_thai =
                'dang_xu_ly';

            /*
             * Người thứ 2 vừa tham gia là
             * server tự động đổ xúc xắc.
             */
            xuLyKetThucDiceDuel(
                phong
            );

            saveDB();

            return res.json({

                thanh_cong: true,

                phong,

                coin:
                    user.coin
            });

        }catch(e){

            console.error(
                'Lỗi tham gia Dice Duel:',
                e
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   DICE DUEL - XEM PHÒNG
   ========================= */

app.get(
    '/api/dice-duel/phong/:ma',
    auth,
    (req, res) => {

        try{

            const data = getDB();

            ensureDiceDuelData(data);

            const maPhong =
                String(
                    req.params.ma || ''
                )
                .trim()
                .toUpperCase();

            const phong =
                data.dice_duel_phong.find(
                    p =>
                        p.ma_phong ===
                        maPhong
                );

            if(!phong){

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy phòng'
                });
            }

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            return res.json({

                thanh_cong: true,

                phong,

                coin:
                    user
                        ? Number(user.coin || 0)
                        : 0
            });

        }catch(e){

            console.error(
                'Lỗi xem phòng Dice Duel:',
                e
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   DICE DUEL - HỦY PHÒNG
   ========================= */

app.post(
    '/api/dice-duel/huy-phong',
    auth,
    (req, res) => {

        try{

            const maPhong =
                String(
                    req.body.ma_phong || ''
                )
                .trim()
                .toUpperCase();

            const data = getDB();

            ensureDiceDuelData(data);

            const phong =
                data.dice_duel_phong.find(
                    p =>
                        p.ma_phong ===
                        maPhong
                );

            if(!phong){

                return res.status(404).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không tìm thấy phòng'
                });
            }

            if(
                Number(
                    phong.nguoi_choi_1.user_id
                ) !==
                Number(req.user.id)
            ){

                return res.status(403).json({
                    thanh_cong: false,
                    thong_bao:
                        'Bạn không phải chủ phòng'
                });
            }

            if(
                phong.trang_thai !==
                'dang_cho'
            ){

                return res.status(400).json({
                    thanh_cong: false,
                    thong_bao:
                        'Không thể hủy phòng này'
                });
            }

            const user =
                timUserPvP(
                    data,
                    req.user.id
                );

            if(user){

                user.coin =
                    Number(user.coin || 0) +
                    Number(phong.tien_cuoc);
            }

            phong.trang_thai =
                'da_huy';

            saveDB();

            return res.json({

                thanh_cong: true,

                phong,

                coin:
                    user
                        ? user.coin
                        : 0
            });

        }catch(e){

            console.error(
                'Lỗi hủy Dice Duel:',
                e
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   DICE DUEL - LỊCH SỬ
   ========================= */

app.get(
    '/api/dice-duel/lich-su',
    auth,
    (req, res) => {

        try{

            const data = getDB();

            ensureDiceDuelData(data);

            const userId =
                Number(
                    req.user.id
                );

            const lichSu =
                data.lichsu_dice_duel
                    .filter(
                        p =>
                            Number(
                                p.nguoi_choi_1?.user_id
                            ) === userId ||
                            Number(
                                p.nguoi_choi_2?.user_id
                            ) === userId
                    )
                    .slice()
                    .reverse();

            return res.json({

                thanh_cong: true,

                lich_su:
                    lichSu
            });

        }catch(e){

            console.error(
                'Lỗi lịch sử Dice Duel:',
                e
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


/* =========================
   LỊCH SỬ PVP
   ========================= */

app.get(
    '/api/pvp/lich-su',
    auth,
    (req, res) => {

        try {

            const data = getDB();

            ensurePvPData(data);

            const userId =
                Number(
                    req.user.id
                );

            const lichSu =
                data.lichsu_pvp
                    .filter(
                        x =>
                            Number(x.user1_id) === userId ||
                            Number(x.user2_id) === userId
                    )
                    .slice(-30)
                    .reverse();

            return res.json({

                thanh_cong:
                    true,

                lich_su:
                    lichSu

            });

        } catch (error) {

            console.error(
                'Lỗi lịch sử PvP:',
                error
            );

            return res.status(500).json({
                thanh_cong: false,
                thong_bao:
                    'Lỗi máy chủ'
            });
        }
    }
);


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

    await db.ready;
    await ensureAdmin();

    khoiDongXoSo();

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
