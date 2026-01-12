import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // নিচের লাইনটি যোগ করুন। আপনার রিপোর নাম যদি 'video-editor' হয়, তবে '/video-editor/' লিখবেন
  base: '/EconMotion-Editor/', 
})
