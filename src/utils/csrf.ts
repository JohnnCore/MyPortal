export const getCsrfToken = (): string | null => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

let csrfInitialized = false;

export const initializeCsrfToken = async (): Promise<void> => {
  // Avoid duplicate network requests (e.g. React.StrictMode double mount)
  if (csrfInitialized) return;

  // If cookie already present, mark initialized and skip fetch
  if (getCsrfToken()) {
    csrfInitialized = true;
    return;
  }

  // Mark as initialized immediately to prevent concurrent fetches
  csrfInitialized = true;

  try {
    await fetch(`${import.meta.env.VITE_APP_API_URL}/auth/csrf`, {
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error initializing CSRF token:', error);
  }
};
