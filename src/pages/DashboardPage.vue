<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="row q-mb-md">
        <!-- User Posts -->
        <div class="col-12 col-md-4 q-pa-md">
          <q-card class="q-ma-md">
            <q-card-section>
              <div class="text-h6">Your Posts</div>
              <div class="text-h4 q-mt-sm">{{ yourPostsCount }}</div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Updates on Animal Life -->
        <div class="col-12 col-md-4 q-pa-md">
          <q-card class="q-ma-md">
            <q-card-section>
              <div class="text-h6">Update Animal Life</div>
              <div class="text-h4 q-mt-sm">{{ updateAnimalLifeCount }}</div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Total Posts from All Users -->
        <div class="col-12 col-md-4 q-pa-md">
          <q-card class="q-ma-md">
            <q-card-section>
              <div class="text-h6">Total Posts</div>
              <div class="text-h4 q-mt-sm">{{ totalPostsCount }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Graph Section -->
      <div class="row justify-center">
        <q-card flat bordered class="q-ma-md">
          <q-card-section>
            <div class="text-h6 text-center">Post Statistics</div>
            <canvas id="chart" style="height: 300px;"></canvas>
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
Chart.register(...registerables);
import { useLoginUserStore } from "../stores/loginUserStore";

export default {
  data() {
    return {
      yourPostsCount: 0,
      updateAnimalLifeCount: 0,
      totalPostsCount: 0,
      retryCount: 0,
      postStatistics: [],
      loginUserStore: useLoginUserStore(),
    }
  },
  computed: {
    userId() {
      return this.loginUserStore.userid;
    },
  },
  methods: {
    async fetchCounts() {
      if (this.retryCount > 3) {
        this.$q.notify({ type: "negative", message: "Failed to load data after several attempts." });
        return;
      }
      try {
        const [userPostsRes, subPostsRes, totalPostsRes, postsOverTimeRes] = await Promise.all([
          this.$api.get(`/post/count/${this.userId}`),
          this.$api.get(`/post/sub-posts/count/${this.userId}`),
          this.$api.get('/post/countAll'),
          this.$api.get('/post/countOverTime')
        ]);
        this.yourPostsCount = userPostsRes.data.totalPostsByUser;
        this.updateAnimalLifeCount = subPostsRes.data.totalSubPostsByUser;
        this.totalPostsCount = totalPostsRes.data.totalPosts;
        this.postStatistics = postsOverTimeRes.data.map(item => item.count);
        this.drawChart(postsOverTimeRes.data.map(item => item.date), this.postStatistics);
      } catch (error) {
        console.error("Error fetching post counts:", error);
        this.$q.notify({ type: "negative", message: "Failed to load data." }); 
      }
    },
    drawChart(labels, data) {
      this.$nextTick(() => {
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels.map(label => new Date(label)), // Ensure labels are date objects
            datasets: [{
              label: 'Total Posts Over Time',
              data: data,
              backgroundColor: 'green',
              borderColor: 'green',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  tooltipFormat: 'MMM dd, yyyy',
                  displayFormats: {
                    day: 'MMM dd'
                  }
                },
                title: {
                  display: true,
                  text: 'Date'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Posts'
                },
                ticks: {
                  // Ensure ticks are integers
                  stepSize: 1,
                  callback: function(value) {
                    if (value % 1 === 0) {
                      return value; // Return only integer values
                    }
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  }
                }
              }
            }
          }
        });
      });
    },
  },
  async mounted() {
    await this.fetchCounts();
  },
}
</script>

<style scoped>
#chart {
  width: 100%;
  height: 300px;
}
</style>
