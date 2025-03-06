
/**
 * Utility function to check if the app is running in a development environment
 * or in the specified Lovable preview URL
 */
export const isDevelopmentOrPreview = (): boolean => {
  return (
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' ||
    window.location.href.includes('lovable.dev/projects/')
  );
};

/**
 * Utility function to check if the app is running in the Lovable editor environment
 */
export const isLovableEditor = (): boolean => {
  return window.location.href.includes('lovable.dev/projects/');
};
