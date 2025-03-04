
/**
 * Utility function to check if the app is running in a development environment
 * or in the specified Lovable preview URL
 */
export const isDevelopmentOrPreview = (): boolean => {
  return (
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' ||
    window.location.href.includes('lovable.dev/projects/944c1b4b-816c-416c-9102-267126cca8ae')
  );
};
