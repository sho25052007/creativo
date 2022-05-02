<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="playlist" class="playlist-details">
      <!-- playlist information -->
      <div class="playlist-info">
          <div class="cover">
              <img :src="playlist.coverUrl" alt="playlist cover image">
          </div>
          <h2>{{ playlist.title }}</h2>
          <p class="username">Created by: {{ playlist.userName }}</p>
          <p class="description">{{ playlist.description }}</p>
          <button v-if="ownership && !isPending" @click="handleDelete">Delete Playlist</button>
          <button v-if="isPending">Deleting...</button>
      </div>

      <!-- song list -->
      <div class="song-list">
          <div v-if="!playlist.songs.length">Start adding songs to this playlist!</div>
          <div v-for="song in playlist.songs" :key="song.id" class="single-song">
            <div class="details">
              <h3>{{ song.title }}</h3>
              <p>{{ song.artist }}</p>
            </div>
            <button v-if="ownership && !isUpdating" @click="handleUpdate(song.id)">Delete</button>
            <button v-if="isUpdating" disabled>Deleting...</button>
          </div>
          <AddSong v-if="ownership" :playlist="playlist"/>
      </div>
  </div>
</template>

<script>
import AddSong from '@/components/AddSong.vue'
import useStorage from '@/composables/useStorage'
import getDocument from '@/composables/getDocument'
import useDocument from '@/composables/useDocument'
import getUser from '@/composables/getUser'

import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
    props: ['id'],
    components: { AddSong },
    setup(props) {
        const { error: deleteImageError, deleteImage } = useStorage()
        const { error, document: playlist } = getDocument('playlists', props.id) //document will be destructured to be called 'playlist'
        const { error: deleteError, isPending, deleteDoc, isUpdating, updateDoc } = useDocument('playlists', props.id)
        const { user } = getUser()
        const router = useRouter()

        const ownership = computed(() => {
          return playlist.value && user.value && user.value.uid == playlist.value.userId
        })

        const handleDelete = async () => {
          await deleteImage(playlist.value.filePath)
          await deleteDoc()
          if (!deleteError.value && !deleteImageError.value) {
            router.push({ name: 'Home' })
          }
        }

        const handleUpdate = async (id) => {
          const filteredSongs = playlist.value.songs.filter(playlistSong => playlistSong.id != id)
          await updateDoc({ songs: [...filteredSongs]})
        }

        return { error, playlist, ownership, isPending, handleDelete, isUpdating, handleUpdate}
    }
}
</script>

<style>
  .playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
  }
  .cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
  }
  .cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 50%;
    max-height: 50%;
  }
  .playlist-info {
    text-align: center;
  }
  .playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
  }
  .playlist-info p {
    margin-bottom: 20px;
  }
  .username {
    color: #999;
  }
  .description {
    text-align: left;
  }
  .single-song {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--secondary);
    margin-bottom: 20px;
  }
</style>