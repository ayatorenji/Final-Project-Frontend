<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="q-pa-md">
        <div class="row justify-between q-mb-md">
          <q-btn color="green" label="Post" @click="showPostModal = true" />
          <q-input
            outlined
            dense
            placeholder="Search Bar"
            class="col-8"
            v-model="searchTerm"
          />
          <q-btn color="green" label="Sort" />
        </div>

        <!-- Post Modal -->
        <q-dialog v-model="showPostModal">
          <q-card style="max-width: 500px">
            <q-card-section class="bg-green text-white">
              <div class="text-h5">Stray Animal Post
                <q-btn align="right" icon="close" flat round dense v-close-popup />
              </div>
            </q-card-section>

            <q-card-section>
              <q-img v-if="postImage" :src="postImage" />
              <q-btn v-else color="green" label="Upload Image" @click="openFileInput" />
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="handleFileUpload" />
            </q-card-section>

            <q-card-section>
              <q-input v-model="animalName" label="Animal's Name" outlined dense />
            </q-card-section>
            <q-card-section>
              <q-input v-model="description" label="Description" outlined dense type="textarea" />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn color="green" label="Submit" @click="submitPost" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <div class="row q-col-gutter-md">
          <div
            class="col-12 col-sm-6 col-md-4"
            v-for="post in filteredPosts"
            :key="post.id"
          >
            <q-card @click="showDetails(post)" class="my-card">
              <q-img :src="post.image" class="fixed-height-img"/>
              <q-card-section class="bg-green text-white">
                <div class="row no-wrap items-center">
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                  <div class="q-ml-sm text-weight-bold">{{ post.author }}</div>
                </div>
              </q-card-section>
              <q-card-section class="fixed-height-content">
                <div class="text-h6">{{ post.title }}</div>
                <div class="text-body1 multiline-truncate">{{ post.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-dialog v-model="detailsDialog">
          <q-card class="my-card">
            <q-card-section>
              <q-img v-if="currentPost.image" :src="currentPost.image" />
            </q-card-section>

            <q-card-section class="bg-green text-white">
              <div class="row items-center justify-between">
                <div class="flex no-wrap items-center">
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                  <div class="q-ml-sm text-h6">{{ currentPost.author }}</div>
                </div>
                <div>
                  <q-btn icon="edit" flat round dense @click="editPost(currentPost)" />
                  <q-btn icon="delete" flat round dense @click="deletePost(currentPost)" />
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="text-h6">{{ currentPost.title }}</div>
              <div class="q-mt-md">{{ currentPost.description }}</div>
            </q-card-section>
            <!-- Your buttons like chat and location go here -->
            <q-card-actions>
              <q-btn color="green" label="Chat" />
              <q-btn color="green" label="Location" />
            </q-card-actions>
          </q-card>
        </q-dialog>

      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      currentPost: null,
      detailsDialog: false,
      showPostModal: false,
      postImage: null,
      animalName: '',
      description: '',
      searchTerm: '',
      posts: [],
    }
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) => {
        const searchTermLower = this.searchTerm.toLowerCase()
        return (
          post.title.toLowerCase().includes(searchTermLower) ||
          post.description.toLowerCase().includes(searchTermLower) ||
          post.author.toLowerCase().includes(searchTermLower)
        )
      })
    },
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      this.postImage = URL.createObjectURL(file)
    },
    showDetails(post) {
      this.currentPost = post;
      this.detailsDialog = true;
    },
    submitPost() {
      // Create a new post object
      const newPost = {
        id: Date.now(), // Using current timestamp as a unique ID
        author: 'Chayanon Rodkeaw', // Replace with actual user data
        title: this.animalName,
        description: this.description,
        image: this.postImage,
      }

      // Add the new post to the posts array
      this.posts.unshift(newPost)

      // Reset the form fields
      this.showPostModal = false
      this.postImage = null
      this.animalName = ''
      this.description = ''
    },
    getData() {
      this.$api.get('/post/all')
        .then((response) => {
          console.log(response.data);
          this.posts = response.data.map((post) => ({
            id: post.id,
            author: post.author || 'Unknown',
            title: post.title,
            description: post.description || 'No description',
            image: post.image,
            created_at: post.created_at,
            updated_at: post.updated_at,
            adopted: post.adopted,
          }));
        })
        .catch((error) => {
          this.$q.notify({
            type: 'negative',
            message: 'Error fetching posts: ' + error.message
          });
        });
    },

  },
  mounted() {
    this.getData();
  },
}
</script>

<style scoped>
.my-card {
  width: 400px;
  max-width: 100%;
  max-height: 100%;
}

.fixed-height-img {
  height: 250px;
}

.fixed-height-content {
  height: 100px;
}

.multiline-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Number of lines you want to display before truncating */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
