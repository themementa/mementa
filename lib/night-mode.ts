/**
 * Check if current time is in night mode (23:00 - 05:00)
 */
export function isNightMode(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 23 || hour < 5;
}

/**
 * Get night mode styles
 */
export function getNightModeStyles() {
  return {
    background: "linear-gradient(135deg, #F5F1EB 0%, #F0ECE5 50%, #EBE7DF 100%)",
    lineHeight: "2.2",
    letterSpacing: "0.03em",
    transitionDuration: "0.4s",
  };
}

