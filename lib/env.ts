/**
 * Environment Variable Utilities
 * Safe access to environment variables with runtime validation
 */

/**
 * Required environment variables and their descriptions
 */
const ENV_VARS = {
  ACTIVECAMPAIGN_URL: 'ActiveCampaign API base URL (e.g., https://account.api-us1.com)',
  ACTIVECAMPAIGN_API_KEY: 'ActiveCampaign API key for authentication',
  NOTION_API_KEY: 'Notion integration API key',
  NOTION_DATABASE_ID: 'Notion database ID for registrations',
  KV_REST_API_URL: 'Vercel KV REST API URL (for rate limiting)',
  KV_REST_API_TOKEN: 'Vercel KV REST API token',
} as const

type EnvVarName = keyof typeof ENV_VARS

/**
 * Cache for environment variables to avoid repeated lookups
 */
const envCache = new Map<string, string>()

/**
 * Get an environment variable with validation
 * Throws a descriptive error if the variable is missing in production
 *
 * @param name - Name of the environment variable
 * @param required - Whether the variable is required (default: true)
 * @returns The environment variable value
 * @throws Error if required variable is missing
 */
export function getEnvVar(name: EnvVarName, required = true): string {
  // Check cache first
  const cached = envCache.get(name)
  if (cached) return cached

  const value = process.env[name]

  if (!value) {
    if (required) {
      const description = ENV_VARS[name] || 'Unknown purpose'
      throw new Error(
        `Missing required environment variable: ${name}\n` +
          `Description: ${description}\n` +
          `Please add this to your Vercel project settings or .env.local file.`
      )
    }
    return ''
  }

  // Cache the value
  envCache.set(name, value)
  return value
}

/**
 * Check if an environment variable exists
 */
export function hasEnvVar(name: EnvVarName): boolean {
  return !!process.env[name]
}

/**
 * Get all missing required environment variables
 * Useful for startup validation
 */
export function getMissingEnvVars(requiredVars: EnvVarName[]): EnvVarName[] {
  return requiredVars.filter((name) => !process.env[name])
}

/**
 * Validate that all required environment variables are present
 * Call this during app initialization
 */
export function validateEnv(requiredVars: EnvVarName[]): void {
  const missing = getMissingEnvVars(requiredVars)

  if (missing.length > 0) {
    const details = missing
      .map((name: EnvVarName) => `  - ${name}: ${ENV_VARS[name]}`)
      .join('\n')

    console.error(
      `Missing required environment variables:\n${details}\n\n` +
        `Please configure these in Vercel project settings or .env.local`
    )

    // In production, this is a fatal error
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing ${missing.length} required environment variable(s)`)
    }
  }
}

/**
 * Optional: Get environment variable with default value
 */
export function getEnvVarWithDefault(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}
