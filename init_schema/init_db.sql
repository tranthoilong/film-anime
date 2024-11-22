DROP TABLE IF EXISTS VideoLinks;
DROP TABLE IF EXISTS Episodes;
DROP TABLE IF EXISTS Chapters;
DROP TABLE IF EXISTS Movies;
DROP TABLE IF EXISTS Images;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Views;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;


CREATE TABLE Roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles (id)
);

CREATE TABLE Images
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    url        VARCHAR(255) NOT NULL, -- Đường dẫn ảnh
    status     INT              DEFAULT 1, -- Trạng thái (1: active, 0: inactive)
    created_at TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Movies
(
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title             VARCHAR(255) NOT NULL,      -- Tiêu đề phim
    short_description VARCHAR(255),               -- Mô tả ngắn
    description       TEXT,                       -- Mô tả dài
    release_year      INT,                        -- Năm phát hành
    view_count        INT              DEFAULT 0, -- Tổng lượt xem
    unique_viewers    INT              DEFAULT 0, -- Số người xem khác nhau
    type              VARCHAR(20)  NOT NULL,      -- Loại phim: 'single', 'series', 'chaptered'
    duration          INT,                        -- Thời lượng (phút) - cho phim đơn
    image_id          UUID,                       -- ID ảnh thumbnail
    status            INT              DEFAULT 1, -- Trạng thái (1: active, 0: inactive)
    created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES Images (id)
);

CREATE TABLE Chapters
(
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id       UUID NOT NULL,     -- Mã phim
    chapter_number INT  NOT NULL,     -- Số chương
    title          VARCHAR(255),      -- Tiêu đề chương
    description    TEXT,              -- Mô tả chương
    status         INT      DEFAULT 1, -- Trạng thái (1: active, 0: inactive)
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES Movies (id),
    UNIQUE (movie_id, chapter_number) -- Đảm bảo số chương không trùng lặp trong phim
);

CREATE TABLE Episodes
(
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id          UUID NOT NULL,              -- Mã phim
    chapter_id        UUID,                       -- Mã chương (nếu có)
    episode_number    INT  NOT NULL,              -- Số tập
    title             VARCHAR(255),               -- Tiêu đề tập
    short_description VARCHAR(255),               -- Mô tả ngắn của tập
    description       TEXT,                       -- Mô tả dài của tập
    duration          INT,                        -- Thời lượng tập (phút)
    view_count        INT              DEFAULT 0, -- Tổng lượt xem của tập
    unique_viewers    INT              DEFAULT 0, -- Số người xem khác nhau của tập
    image_id          UUID,                       -- ID ảnh thumbnail
    status            INT              DEFAULT 1, -- Trạng thái (1: active, 0: inactive)
    created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES Movies (id),
    FOREIGN KEY (chapter_id) REFERENCES Chapters (id),
    FOREIGN KEY (image_id) REFERENCES Images (id),
    UNIQUE (movie_id, chapter_id, episode_number) -- Đảm bảo số tập không trùng lặp trong chương/phim
);

CREATE TABLE VideoLinks
(
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id     UUID         NOT NULL,      -- Mã phim
    episode_id   UUID,                       -- Mã tập (nếu có)
    link_order   INT          NOT NULL,      -- Thứ tự link (1,2,3)
    link         VARCHAR(255) NOT NULL,      -- URL video
    status       INT              DEFAULT 1, -- Trạng thái link (1: active, 0: inactive)
    last_checked TIMESTAMP,                  -- Thời điểm kiểm tra link cuối cùng
    created_at   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES Movies (id),
    FOREIGN KEY (episode_id) REFERENCES Episodes (id),
    CHECK (link_order BETWEEN 1 AND 3)       -- Đảm bảo chỉ có 3 link
);

CREATE TABLE Views
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id      UUID NOT NULL, -- Mã phim
    episode_id    UUID,          -- Mã tập (nếu có)
    ip_address    VARCHAR(45),   -- IP của người xem
    user_agent    TEXT,          -- User agent của trình duyệt
    viewed_at     TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    view_duration INT,           -- Thời gian xem (giây)
    status        INT              DEFAULT 1, -- Trạng thái (1: active, 0: inactive)
    created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES Movies (id),
    FOREIGN KEY (episode_id) REFERENCES Episodes (id)
);

CREATE TABLE Comments
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id   UUID         NOT NULL,      -- Mã phim
    episode_id UUID,                       -- Mã tập (nếu có)
    parent_id  UUID,                       -- ID comment cha (nếu là reply)
    user_name  VARCHAR(255) NOT NULL,      -- Tên người dùng
    content    TEXT         NOT NULL,      -- Nội dung bình luận
    likes      INT              DEFAULT 0, -- Số lượt thích
    status     INT              DEFAULT 1, -- Trạng thái (1: active, 0: inactive)
    created_at TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES Movies (id),
    FOREIGN KEY (episode_id) REFERENCES Episodes (id),
    FOREIGN KEY (parent_id) REFERENCES Comments (id)
);
