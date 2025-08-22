import { DataKeys } from '@renderer/types'

export const useData = () => {
  const { ipcRenderer } = window.require('electron')

  const get = async (key: DataKeys): Promise<string | Record<string, any> | undefined> => {
    const data = await ipcRenderer.invoke('store-get', key)

    return data
  }

  const set = async (key: DataKeys, value: string | Record<string, any>) => {
    await ipcRenderer.invoke('store-set', key, value)
  }

  return { get, set }
}
