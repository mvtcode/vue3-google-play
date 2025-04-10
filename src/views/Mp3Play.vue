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
    <audio
      v-if="audioUrl"
      autoplay
      :src="audioUrl"
      controls
      class="audio-player"
      ref="audioPlayer"
    ></audio>
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
const audioPlayer = ref<HTMLAudioElement | null>(null)

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

    // Thêm timestamp để tránh cache và đảm bảo request luôn đi qua Nginx proxy
    const timestamp = new Date().getTime()
    audioUrl.value = `/api/gdrive-proxy/${fileId[0]}?_t=${timestamp}`

    // Xác nhận bằng console.log để debug
    console.log('Đang yêu cầu proxy qua:', audioUrl.value)

    // Đợi một chút để đảm bảo audio element đã được cập nhật với URL mới
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Tự động phát nhạc
    if (audioPlayer.value) {
      try {
        await audioPlayer.value.play()
      } catch (playError) {
        console.error('Không thể tự động phát nhạc:', playError)
        errorMessage.value =
          'Trình duyệt không cho phép tự động phát nhạc. Vui lòng click vào nút play.'
      }
    }
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
