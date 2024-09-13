<template>
  <q-page>
    <div id="map" style="height: calc(100vh - 50px)"></div>

    <!-- Post Detail Modal -->
    <q-dialog v-model="showPostDetailDialog">
      <q-card style="max-width: 500px;">
        <q-card-section>
          <q-img :src="selectedPost.image" style="max-width: 100%;" />
        </q-card-section>

        <q-card-section class="bg-green text-white">
          <div class="row no-wrap items-center">
            <q-avatar>
              <img :src="selectedPost.authorImg" />
            </q-avatar>
            <div class="q-ml-sm text-weight-bold">{{ selectedPost.author }}</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ selectedPost.title }}</div>
          <div class="text-body2" v-if="selectedPost.locationName" style="font-size: 0.85rem; color: gray;">
            {{ selectedPost.locationName }}
          </div>
          <div class="text-body1">{{ selectedPost.description }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="green" label="Chat" @click="openChat" />
          <q-btn color="green" label="Location" @click="openLocation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  data() {
    return {
      map: null,
      showPostDetailDialog: false,
      selectedPost: {
        title: '',
        image: '',
        description: '',
        locationName: '',
        author: '',
        authorImg: '',
      },
    };
  },
  methods: {
    async fetchMapLocations() {
      try {
        // Fetch all map locations from the backend
        const response = await this.$api.get('/map-location');
        return response.data; // Assuming API returns an array of map locations
      } catch (error) {
        console.error('Error fetching map locations:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load map locations.',
        });
        return [];
      }
    },
    async initializeMap() {
      this.map = L.map('map').setView([7.8804, 98.3923], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      const locations = await this.fetchMapLocations();

      locations.forEach((location) => {
        const marker = L.marker([location.latitude, location.longitude]).addTo(this.map);

        // On marker click, show the post detail dialog
        marker.on('click', () => {
          this.selectedPost = {
            title: location.title,
            image: location.image,
            description: location.postDescription,
            locationName: location.locationName,
            author: location.author,
            authorImg: location.authorImg,
          };
          this.showPostDetailDialog = true;
        });
      });
    },
    openChat() {
      // Handle the chat button click here
      console.log('Chat clicked');
    },
    openLocation() {
      // Handle the location button click here
      console.log('Location clicked');
    },
  },
  mounted() {
    this.initializeMap();
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
