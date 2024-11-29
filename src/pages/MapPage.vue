<template>
  <q-page>
    <div id="map" style="height: calc(100vh - 50px)"></div>

    <!-- Post Detail Modal -->
    <q-dialog v-model="showPostDetailDialog">
      <q-card style="max-width: 500px;">
        <q-card-section>
          <q-img :src="selectedPost.postimg" style="max-width: 100%;" />
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
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default {
  data() {
    return {
      map: null,
      userLocation: null,
      showPostDetailDialog: false,
      selectedPost: {
        title: '',
        postimg: '',
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
        return response.data || [];
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

      if (this.map) {
        // Prevent reinitializing the map
        console.log('Map already initialized.');
        return;
      }
      
      // this.map = L.map('map').setView([7.8804, 98.3923], 10);
      const defaultCenter = [7.8804, 98.3923];
      this.map = L.map('map').setView(defaultCenter, 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('User location:', latitude, longitude);
            this.userLocation = { latitude, longitude };

            // Update map view to user's location
            this.map.setView([latitude, longitude], 13);

            // Add a marker for the user's location
            L.marker([latitude, longitude], { icon: redIcon })
              .addTo(this.map)
              .bindPopup('You are here!')
          },
          (error) => {
            console.error('Error getting user location:', error);
            this.$q.notify({
              type: 'warning',
              message: 'Unable to retrieve your location. Showing default location.',
            });
          }
        );
      }

      const locations = await this.fetchMapLocations();

      locations.forEach((location) => {
        if (location.adopted === 0) {
          const marker = L.marker([location.latitude, location.longitude]).addTo(this.map);

          // On marker click, show the post detail dialog
          marker.on('click', () => {
            this.selectedPost = {
              title: location.title,
              postimg: location.postImage,
              description: location.postDescription,
              locationName: location.description,
              author: location.fullname,
              authorImg: location.userImage,
            };
            this.showPostDetailDialog = true;
          });
        }
      });
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
