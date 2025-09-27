import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  controlWindow: (data) => ipcRenderer.invoke('control-window', data),
  saveImage: (base64Data, fileName) => ipcRenderer.invoke('save-image', base64Data, fileName),
  login: async (data) => ipcRenderer.invoke('login', data),
  emailVerfication: async (data) => ipcRenderer.invoke('email-verfication', data),
  resetPassword: async (data) => ipcRenderer.invoke('reset-password', data),
  updateProfile: async (data) => ipcRenderer.invoke('update-profile', data)
})
