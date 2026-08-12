# Lessons Learned — SRM Bats Project

## Tool Usage

### 1. Never use `netstat` or `findstr` to check ports
**Date:** 2026-07-15
**Context:** Trying to check if PostgreSQL is running on port 5433
**Root Cause:** `netstat -ano | findstr ":5433"` times out or gets cancelled — wastes a full turn
**Fix:** Don't check. Just attempt the DB operation and handle the error message (it tells you the port).
**Prevention:** If the DB isn't reachable, the Prisma error message gives the exact URL. Trust the error, not a port scan. Never run `netstat` or `findstr` for port detection.

---

## PowerShell

### 2. PowerShell does not support `&&` as a command separator
**Date:** 2026-07-15
**Context:** `cd apps/api && pnpm add ...`
**Root Cause:** `&&` is bash syntax. PowerShell 5.1 does not support it.
**Fix:** Use the `cwd` parameter in `execute_command`, or chain with `; if ($?) { ... }`.
**Prevention:** Always use `cwd` parameter for directory context. Never use `&&` in PowerShell commands.

---
