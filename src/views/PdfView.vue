<template>
  <div class="pdf-viewer">
    <h1>PDF Viewer</h1>
    <div class="input-group">
      <input
        type="text"
        v-model="driveLink"
        placeholder="Nhập link Google Drive PDF"
        class="drive-input"
      />
      <button @click="convertAndView" class="view-button">Xem</button>
    </div>
    <div v-if="isLoading" class="loading">Đang tải...</div>
    <iframe v-if="pdfUrl" :src="pdfUrl" class="pdf-frame" allow="fullscreen"></iframe>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const driveLink = ref(
  'https://drive.google.com/file/d/1b_QHCM3fNE7lYvrB_aZK190L-SqoAHeU/view?usp=sharing',
)
const pdfUrl = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const convertAndView = async () => {
  if (!driveLink.value) return

  // Reset state
  pdfUrl.value = ''
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Lấy ID file từ Google Drive link
    const fileId = driveLink.value.match(/[-\w]{25,}/)
    if (!fileId) {
      throw new Error('Link Google Drive không hợp lệ')
    }

    // Sử dụng Google Drive Viewer để xem PDF
    pdfUrl.value = `https://drive.google.com/file/d/${fileId[0]}/preview`
  } catch (error) {
    console.error('Lỗi khi chuyển đổi link:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi xử lý link'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.pdf-viewer {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.drive-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.view-button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.view-button:hover {
  background-color: #45a049;
}

.pdf-frame {
  width: 100%;
  height: 800px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.loading {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.error-message {
  margin-top: 10px;
  color: red;
  font-size: 14px;
}
</style>
