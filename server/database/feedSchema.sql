-- Connectify Feed tables (PostgreSQL — run after schema.sql)

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  image_url VARCHAR(500),
  visibility VARCHAR(10) NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_posts_visibility CHECK (visibility IN ('public', 'private'))
);

CREATE INDEX IF NOT EXISTS ix_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS ix_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS ix_posts_visibility ON posts(visibility);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS ix_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS ix_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS ix_comments_created_at ON comments(created_at);

CREATE TABLE IF NOT EXISTS replies (
  id SERIAL PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_replies_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  CONSTRAINT fk_replies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS ix_replies_comment_id ON replies(comment_id);
CREATE INDEX IF NOT EXISTS ix_replies_user_id ON replies(user_id);
CREATE INDEX IF NOT EXISTS ix_replies_created_at ON replies(created_at);

CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  target_type VARCHAR(10) NOT NULL,
  target_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_likes_target_type CHECK (target_type IN ('post', 'comment', 'reply')),
  CONSTRAINT uq_likes_user_target UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS ix_likes_target ON likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS ix_likes_user_id ON likes(user_id);
