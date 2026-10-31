Implement JWT verification and a tenant-aware principal here. Never accept tenantId from request JSON
or query parameters as authorization; derive it exclusively from a verified identity claim.
