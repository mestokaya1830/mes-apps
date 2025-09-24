import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  login: async (user) => ipcRenderer.invoke('login', user),
  emailVerfication: async (email) => ipcRenderer.invoke('email-verfication', email),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  updateProfile: async (data) => ipcRenderer.invoke('update-profile', data)
})
