-- Connectify Feed tables (run after schema.sql)

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'posts')
BEGIN
  CREATE TABLE posts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    text NVARCHAR(MAX) NOT NULL,
    image_url NVARCHAR(500) NULL,
    visibility NVARCHAR(10) NOT NULL DEFAULT 'public',
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT CK_posts_visibility CHECK (visibility IN ('public', 'private'))
  );

  CREATE INDEX IX_posts_user_id ON posts(user_id);
  CREATE INDEX IX_posts_created_at ON posts(created_at DESC);
  CREATE INDEX IX_posts_visibility ON posts(visibility);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'comments')
BEGIN
  CREATE TABLE comments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    text NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT FK_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION
  );

  CREATE INDEX IX_comments_post_id ON comments(post_id);
  CREATE INDEX IX_comments_user_id ON comments(user_id);
  CREATE INDEX IX_comments_created_at ON comments(created_at);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'replies')
BEGIN
  CREATE TABLE replies (
    id INT IDENTITY(1,1) PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    text NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_replies_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT FK_replies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION
  );

  CREATE INDEX IX_replies_comment_id ON replies(comment_id);
  CREATE INDEX IX_replies_user_id ON replies(user_id);
  CREATE INDEX IX_replies_created_at ON replies(created_at);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'likes')
BEGIN
  CREATE TABLE likes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    target_type NVARCHAR(10) NOT NULL,
    target_id INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT CK_likes_target_type CHECK (target_type IN ('post', 'comment', 'reply')),
    CONSTRAINT UQ_likes_user_target UNIQUE (user_id, target_type, target_id)
  );

  CREATE INDEX IX_likes_target ON likes(target_type, target_id);
  CREATE INDEX IX_likes_user_id ON likes(user_id);
END
GO
