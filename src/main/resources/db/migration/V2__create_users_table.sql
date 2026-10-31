
CREATE TABLE app_users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_app_users_role
        CHECK (role IN ('ADMIN', 'OPERATOR', 'EMPLOYEE'))
);

CREATE UNIQUE INDEX uk_app_users_username
    ON app_users (LOWER(username));

CREATE INDEX idx_app_users_tenant
    ON app_users (tenant_id);
