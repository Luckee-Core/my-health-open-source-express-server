import Anthropic from '@anthropic-ai/sdk';

let managedClient: Anthropic | null = null;

/**
 * Initializes the managed Anthropic client from ANTHROPIC_API_KEY.
 */
export const initializeManagedAnthropicClient = (): void => {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    console.log('⚠️ ANTHROPIC_API_KEY not set — therapy photo import unavailable');
    managedClient = null;
    return;
  }
  managedClient = new Anthropic({ apiKey });
  console.log('✅ Anthropic client initialized');
};

/**
 * Returns the managed Anthropic client, or null if unavailable.
 */
export const getManagedAnthropicClient = (): Anthropic | null => managedClient;
