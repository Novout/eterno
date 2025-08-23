export const useEnv = () => {
  const getPackageVersion = () => import.meta.env.PACKAGE_VERSION
  const isDev = () => import.meta.env.DEV

  return { getPackageVersion, isDev }
}
