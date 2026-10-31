-- Atomically increments the fencing counter and assigns the lease.
-- KEYS[1]=fencing counter, KEYS[2]=lease key; ARGV[1]=owner; ARGV[2]=ttl ms
local token = redis.call('INCR', KEYS[1])
redis.call('SET', KEYS[2], ARGV[1], 'PX', ARGV[2])
return token
