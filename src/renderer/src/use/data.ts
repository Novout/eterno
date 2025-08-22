import { DataKeys } from '@renderer/types'
import { destr } from "destr";

export const useData = () => {
  const { ipcRenderer } = window.require('electron')

  const get = async (key: DataKeys): Promise<Record<string, any> | undefined> => {
    const data = await ipcRenderer.invoke('store-get', key)

    return destr(data)
  }

  const set = async (key: DataKeys, value: string | Record<string, any>) => {
    await ipcRenderer.invoke('store-set', key, JSON.stringify(value))
  }

  return { get, set }
}
