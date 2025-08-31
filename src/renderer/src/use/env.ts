export const useEnv = () => {
  const getPackageVersion = () => import.meta.env.PACKAGE_VERSION
  const isDev = () => import.meta.env.DEV
  const getSentry = () => import.meta.env.VITE_SENTRY_URL

  return { getPackageVersion, isDev, getSentry }
}
