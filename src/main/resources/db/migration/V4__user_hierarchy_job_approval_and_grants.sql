
-- ============================================================
-- V4: User hierarchy, job ownership, approval workflow,
--     and individual approval permission grants
-- ============================================================

-- 1. USER HIERARCHY
-- Admin: parent_user_id = NULL
-- Operator: parent_user_id = Admin UUID
-- Employee: parent_user_id = Operator UUID

ALTER TABLE app_users
ADD COLUMN parent_user_id UUID;

-- Required for composite foreign keys that enforce same-tenant
-- relationships between users.
ALTER TABLE app_users
ADD CONSTRAINT uk_app_users_id_tenant
UNIQUE (id, tenant_id);

ALTER TABLE app_users
ADD CONSTRAINT fk_app_users_parent
FOREIGN KEY (parent_user_id, tenant_id)
REFERENCES app_users (id, tenant_id);

CREATE INDEX idx_app_users_parent
ON app_users (parent_user_id, tenant_id);


-- 2. JOB OWNERSHIP AND APPROVAL

ALTER TABLE scheduled_jobs
ADD COLUMN created_by_user_id UUID;

ALTER TABLE scheduled_jobs
ADD COLUMN approval_status VARCHAR(20)
NOT NULL DEFAULT 'NOT_REQUIRED';

ALTER TABLE scheduled_jobs
ADD COLUMN approved_by_user_id UUID;

ALTER TABLE scheduled_jobs
ADD COLUMN approval_updated_at TIMESTAMPTZ;

-- Existing jobs remain executable and are not blocked by
-- the new approval workflow.
ALTER TABLE scheduled_jobs
ADD CONSTRAINT chk_jobs_approval_status
CHECK (
    approval_status IN (
        'PENDING',
        'APPROVED',
        'REJECTED',
        'NOT_REQUIRED'
    )
);

-- Creator must belong to the same tenant as the job.
ALTER TABLE scheduled_jobs
ADD CONSTRAINT fk_jobs_creator
FOREIGN KEY (created_by_user_id, tenant_id)
REFERENCES app_users (id, tenant_id);

-- Approver must belong to the same tenant as the job.
ALTER TABLE scheduled_jobs
ADD CONSTRAINT fk_jobs_approver
FOREIGN KEY (approved_by_user_id, tenant_id)
REFERENCES app_users (id, tenant_id);

CREATE INDEX idx_jobs_creator
ON scheduled_jobs (created_by_user_id);

CREATE INDEX idx_jobs_approval
ON scheduled_jobs (tenant_id, approval_status);


-- 3. INDIVIDUAL APPROVAL PERMISSION GRANTS
-- An Admin can grant an Operator permission.
-- An Operator can grant an Employee permission.
-- Each grant belongs to one specific user.

CREATE TABLE user_permission_grants (
    id UUID PRIMARY KEY,

    tenant_id VARCHAR(100) NOT NULL,

    grantor_user_id UUID NOT NULL,

    grantee_user_id UUID NOT NULL,

    permission VARCHAR(60) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    revoked_at TIMESTAMPTZ,

    CONSTRAINT chk_user_grant_permission
        CHECK (
            permission IN ('CREATE_JOB_WITHOUT_APPROVAL')
        ),

    CONSTRAINT fk_user_grant_grantor
        FOREIGN KEY (grantor_user_id, tenant_id)
        REFERENCES app_users (id, tenant_id),

    CONSTRAINT fk_user_grant_grantee
        FOREIGN KEY (grantee_user_id, tenant_id)
        REFERENCES app_users (id, tenant_id),

    CONSTRAINT uk_user_grant_permission
        UNIQUE (tenant_id, grantee_user_id, permission)
);

CREATE INDEX idx_user_grants_grantor
ON user_permission_grants (grantor_user_id, tenant_id);

CREATE INDEX idx_user_grants_grantee
ON user_permission_grants (grantee_user_id, tenant_id, active);
