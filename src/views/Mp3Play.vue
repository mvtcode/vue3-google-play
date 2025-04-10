<template>
  <div class="mp3-player">
    <h1>MP3 Player</h1>
    <div class="input-group">
      <input
        type="text"
        v-model="driveLink"
        placeholder="Nhập link Google Drive MP3"
        class="drive-input"
      />
      <button @click="convertAndPlay" class="play-button">Phát nhạc</button>
    </div>
    <div v-if="isLoading" class="loading">Đang tải...</div>
    <audio v-if="audioUrl" :src="audioUrl" controls class="audio-player"></audio>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const driveLink = ref(
  'https://drive.google.com/file/d/1Giwm6I5XsW_ZOhoT9zrJgx68Yzro8yAD/view?usp=drive_link',
)
const audioUrl = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const convertAndPlay = async () => {
  if (!driveLink.value) return

  // Reset state
  audioUrl.value = ''
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Lấy ID file từ Google Drive link
    const fileId = driveLink.value.match(/[-\w]{25,}/)
    if (!fileId) {
      throw new Error('Link Google Drive không hợp lệ')
    }

    const gdriveDirect = `https://drive.google.com/uc?export=download&id=${fileId[0]}`
    audioUrl.value = `https://api.allorigins.win/raw?url=${encodeURIComponent(gdriveDirect)}`
  } catch (error) {
    console.error('Lỗi khi chuyển đổi link:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi xử lý link'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.mp3-player {
  max-width: 600px;
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

.play-button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.play-button:hover {
  background-color: #45a049;
}

.audio-player {
  width: 100%;
  margin-top: 20px;
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
