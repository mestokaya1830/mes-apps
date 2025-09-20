import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  login: async (user) => ipcRenderer.invoke('login', user)
})
