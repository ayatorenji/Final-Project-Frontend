<!-- <template>
  <q-page padding>
    <div class="q-pa-md">
      <q-btn color="primary" label="Post Animal" @click="openDialog" />
    </div>

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Post about a Stray Animal</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md" ref="postForm" @submit.prevent="submitPost">
            <q-input v-model="form.name" label="Animal's Name" :rules="[val => !!val || 'Name is required']" />
            <q-input v-model="form.description" label="Description" type="textarea" :rules="[val => !!val || 'Description is required']" />
            <q-file v-model="form.file" label="Upload Image" :rules="[val => !!val || 'Image is required']" accept=".jpg, .jpeg, .png" />
            <q-select v-model="form.location" :options="locations" label="Location Found" emit-value map-options :rules="[val => !!val || 'Location is required']" />
            <div class="q-pt-md">
              <q-btn label="Post" type="submit" color="primary" />
              <q-btn flat label="Cancel" color="primary" v-close-popup />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <div class="q-gutter-md row items-start" v-for="animal in animals" :key="animal.id">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">{{ animal.name }}</div>
            <div class="text-subtitle2">{{ animal.description }}</div>
            <q-img :src="animal.image" :ratio="4/3" />
            <div>Location: {{ animal.location }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat @click="viewDetails(animal.id)">View Details</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      form: {
        name: '',
        description: '',
        file: null,
        location: ''
      },
      locations: [
        { label: 'Location 1', value: 'location1' },
        { label: 'Location 2', value: 'location2' },
        // Add more locations as needed
      ],
      animals: []
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    submitPost() {
      const formData = new FormData();
      formData.append("name", this.form.name);
      formData.append("description", this.form.description);
      formData.append("location", this.form.location);
      formData.append("image", this.form.file);

      this.$api.post("/api/post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        this.dialog = false;
        this.fetchPosts(); // Reload the posts
        this.$q.notify({
          type: 'positive',
          message: 'Animal posted successfully'
        });
      }).catch(error => {
        console.error('Post creation error:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Posting failed: ' + error.message
        });
      });
    },
    fetchPosts() {
      this.$api.get("/api/post/all").then(response => {
        this.animals = response.data;
      }).catch(error => {
        console.error('Error fetching posts:', error);
      });
    },
    viewDetails(postId) {
      this.$router.push({ name: 'PostDetails', params: { postId } });
    }
  },
  mounted() {
    this.fetchPosts();
  }
};
</script>

<style>
.my-card {
  width: 300px;
}
</style> -->

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
              <div class="text-h6">STRAY ANIMAL POST</div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <q-img v-if="postImage" :src="postImage" />
              <q-btn v-else color="green" label="Upload Image" @click="openFileInput" />
              <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="handleFileUpload" />
            </q-card-section>

            <q-card-section>
              <q-input v-model="animalName" label="Animal's Name" outlined dense />
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
            <q-card>
              <q-img :src="post.image" />
              <q-card-section>
                <div class="row no-wrap items-center">
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                  <div class="q-ml-sm">
                    <div class="text-weight-bold">{{ post.author }}</div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-h6">{{ post.title }}</div>
                <div class="text-body1">{{ post.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      showPostModal: false,
      postImage: null,
      animalName: '',
      description: '',
      searchTerm: '',
      posts: [
      {
          id: 1,
          author: 'Chayanon Rodkeaw',
          title: 'John the cat',
          description:
            'Found around Patong beach on Feb 22 2024. He\'s friendly if you want to play with him or want to adopt him please come to Patong ...',
          image: 'https://cdn.quasar.dev/img/cat.jpg',
        },
        {
          id: 2,
          author: 'Smith Melon',
          title: '2 Kitten',
          description:
            'Found around Old town on Feb 19 2024. I found 2 little kitten here but I don\'t have time to adopt it',
          image: 'https://cdn.quasar.dev/img/kittens.jpg',
        },
        {
          id: 3,
          author: 'I Love Dogs',
          title: 'Poor Dog',
          description:
            'Found around Wat Chalong Temple on Feb 19 2024. Hey I find this dog from the entrance of Wat Chalong Temple. I have my own dogs, so I...',
          image: 'https://cdn.quasar.dev/img/dog.jpg',
        },
        {
          id: 4,
          author: 'Tommy',
          title: 'Unknown Dogs',
          description: 'Found around Central Phuket on Feb 15 2024. Many poor dogs :(',
          image: 'https://cdn.quasar.dev/img/dogs.jpg',
        },
        {
          id: 5,
          author: 'Polar Bear',
          title: 'Unknown',
          description: 'Found around University on Feb 7 2024. No Description',
          image: 'https://cdn.quasar.dev/img/dog.jpg',
        },
        {
          id: 6,
          author: 'Susan',
          title: 'Kittens',
          description:
            'Found around Old town on Jan 30 2024. How cute of them! I want to adopt them but I don\'t have time.',
          image: 'https://cdn.quasar.dev/img/kittens.jpg',
        },
      ],
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
  },
}
</script>
