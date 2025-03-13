
/**
 * Utility function to check if the app is running in a development environment
 * or in the specified Lovable preview URL
 */
export const isDevelopmentOrPreview = (): boolean => {
  return (
    process.env.NODE_ENV === 'development' || 
    window.location.hostname === 'localhost' ||
    window.location.href.includes('lovable.dev/projects/') ||
    window.location.hostname === 'musica-perfeita.lovable.app' ||
    window.location.hostname === 'musicaperfeita.com.br'
  );
};

/**
 * Utility function to check if the app is running in the Lovable editor environment
 */
export const isLovableEditor = (): boolean => {
  return window.location.href.includes('lovable.dev/projects/');
};
