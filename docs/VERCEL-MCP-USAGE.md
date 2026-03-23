# Vercel MCP Usage — Proactive Workflow

**Purpose:** Always use Vercel MCP tools proactively to check environment variables, deployments, and project status without being asked.

---

## Available Vercel MCP Tools

The `user-vercel` MCP server provides tools for managing Vercel projects. Key tools:

### Environment Variables
- `vercel_list_env_vars` — List all environment variables for a project
- `vercel_create_env_var` — Create a new environment variable
- `vercel_batch_create_env_vars` — Create multiple env vars at once

### Deployments
- `vercel_list_deployments` — List deployments for a project
- `vercel_get_deployment` — Get deployment details
- `vercel_create_deployment` — Create a new deployment

### Projects
- `vercel_list_projects` — List all projects
- `vercel_get_project` — Get project details

---

## When to Use Vercel MCP Tools

**Always check proactively when:**
1. **Setting up new integrations** (e.g., Postmark, ActiveCampaign)
   - Verify environment variables are set
   - Check if they're applied to correct environments (production, preview, development)

2. **Before deployments**
   - Verify required env vars exist
   - Check deployment status
   - Confirm project configuration

3. **Troubleshooting issues**
   - Check if env vars are missing or incorrect
   - Verify deployment logs
   - Check project settings

4. **After code changes**
   - Verify deployments succeeded
   - Check if new env vars need to be added
   - Confirm production status

---

## LBTA Project Information

**Vercel Project:**
- Name: `laguna-beach-tennis-academy`
- Project ID: `prj_vr7VKBTayqDiSCrQ5yILJgXNUY0t`
- Team: `andrew-mateljans-projects`
- Production Domain: `lagunabeachtennisacademy.com`

**Common Environment Variables to Check:**
- `POSTMARK_SERVER_TOKEN` — Postmark email integration
- `POSTMARK_FROM_EMAIL` — Postmark sender address (optional)
- `ACTIVECAMPAIGN_URL` — ActiveCampaign API URL
- `ACTIVECAMPAIGN_API_KEY` — ActiveCampaign API key
- `NOTION_API_KEY` — Notion integration
- `NOTION_DATABASE_ID` — Notion database ID
- `AGENT_SECRET` — Agent tools authentication
- `KV_REST_API_URL` — Vercel KV for rate limiting
- `KV_REST_API_TOKEN` — Vercel KV token

---

## Authentication

**Note:** Vercel MCP requires OAuth authentication. If you get a 403 error:
1. The MCP server may need to be re-authenticated
2. Check `.cursor/mcp.json` for Vercel configuration
3. May need to run `vercel login` or re-authenticate in Cursor

---

## Example Workflow

### Checking Postmark Environment Variables

```typescript
// Proactively check when working with email integration
call_mcp_tool({
  server: "user-vercel",
  toolName: "vercel_list_env_vars",
  arguments: {
    projectId: "laguna-beach-tennis-academy"
  }
})

// Filter for POSTMARK variables
// Verify they're set for production environment
```

### Adding Missing Environment Variables

```typescript
// If POSTMARK_SERVER_TOKEN is missing, add it proactively
call_mcp_tool({
  server: "user-vercel",
  toolName: "vercel_create_env_var",
  arguments: {
    projectId: "laguna-beach-tennis-academy",
    key: "POSTMARK_SERVER_TOKEN",
    value: "15dc4e0e-a75b-4444-b97a-6b4ef58d86b7",
    target: ["production", "preview", "development"],
    type: "encrypted"
  }
})
```

---

## Memory Note

**Always remember:** When working on integrations, deployments, or troubleshooting, proactively use Vercel MCP tools to:
- Check environment variables
- Verify deployment status
- Confirm project configuration
- Add missing environment variables

Don't wait to be asked — check Vercel status as part of the workflow.

---

*This document serves as a reminder to always use Vercel MCP tools proactively.*
