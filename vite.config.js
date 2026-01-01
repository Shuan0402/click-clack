import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 暫時先註解掉這一行，本地開發會比較順利
  // base: '/click-clack/', 
})