#!/usr/bin/env bash
# Launcher for ActiveCampaign MCP so Cursor finds uvx even when PATH is minimal.
# Usage: .cursor/run-ac-mcp.sh (env AC_API_URL and AC_API_TOKEN must be set by Cursor from mcp.json)
UVX="/opt/homebrew/bin/uvx"
[[ -x /usr/local/bin/uvx ]] && UVX="/usr/local/bin/uvx"
exec "$UVX" ac-mcp-server
