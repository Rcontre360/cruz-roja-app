/**
 * Retries a given function with delays until it succeeds or reaches a maximum number of attempts.
 * @param action - A function that returns a Promise.
 * @param maxAttempts - The maximum number of attempts to retry.
 * @param retryDelay - The delay between retries in milliseconds.
 * @returns Promise resolving to the result of the action function.
 * @throws Error after exceeding the maximum number of attempts.
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxAttempts: number = 3,
  retryDelay: number = 2000
): Promise<T> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      return await action(); // Attempt the passed function
    } catch (error) {
      if (attempts >= maxAttempts) {
        throw error; // Rethrow the last error encountered after all retries are exhausted.
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Delay before the next retry.
    }
  }

  throw new Error('Max attempts exceeded'); // Fallback error if while loop has a logical flaw.
}

