-- =============================================================================
-- Dashboard seed data
-- Run manually AFTER the stack is up and migrations have been applied:
--
--   docker exec -i react-mysql-server-1 \
--     mysql -u identity-server -ppassword identity-server < docker/mysql/seed.sql
--
-- Passwords:
--   admin@dashboard.com  →  Admin123!
--   alice@dashboard.com  →  User123!
--   bob@dashboard.com    →  User456!
-- =============================================================================

DROP PROCEDURE IF EXISTS seed_users;

DELIMITER //

CREATE PROCEDURE seed_users()
BEGIN
    -- Verify required tables exist; abort with a clear message if not
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = 'identity_users'
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Table identity_users not found — run migrations first';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = 'login_tokens'
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Table login_tokens not found — run migrations first';
    END IF;

    -- Seed accounts (INSERT IGNORE skips rows whose id already exists)
    INSERT IGNORE INTO identity_users
        (id, first_name, last_name, email, password, company, post_code, terms, role)
    VALUES
        (
            '00000000-0000-0000-0000-000000000001',
            'Admin', 'User',
            'admin@dashboard.com',
            '$2a$04$l4VwUQ721Xlt7j26HHrNL.0qthXn0ZrLeqsVJFTnK/Z802GEjRSQu',
            'Dashboard', '00000', 1, 'ADMIN'
        ),
        (
            '00000000-0000-0000-0000-000000000002',
            'Alice', 'Smith',
            'alice@dashboard.com',
            '$2a$04$jTJO2ToiUS40WDBbaGJ3yenkyTfZs9zntEIzilGLyKoblS99LXmJ.',
            'Dashboard', '00000', 1, 'USER'
        ),
        (
            '00000000-0000-0000-0000-000000000003',
            'Bob', 'Jones',
            'bob@dashboard.com',
            '$2a$04$WTcnIeWx1WeLUKSGfNmuiu5ApvEGxExm16nP6pFl/xcs0qPgMN0RG',
            'Dashboard', '00000', 1, 'USER'
        );

    SELECT CONCAT('Seeded ', ROW_COUNT(), ' account(s)') AS result;
END //

DELIMITER ;

CALL seed_users();

DROP PROCEDURE IF EXISTS seed_users;
