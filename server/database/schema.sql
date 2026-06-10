-- Connectify Users table
-- Run against the social_app database (or your configured DB name)

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
  CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_users_email UNIQUE (email)
  );
END
GO
