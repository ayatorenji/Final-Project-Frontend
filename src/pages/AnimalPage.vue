<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="q-pa-md">
        <div class="row justify-between q-mb-md">
          <q-btn color="green" label="Post" @click="handlePostButtonClick " />
          <q-input
            outlined
            dense
            placeholder="Search Bar"
            class="col-8"
            v-model="searchTerm"
          />
          <q-btn-dropdown color="green" label="Sort">
            <q-list>
              <q-item clickable v-close-popup @click="sortPosts('newest')">
                <q-item-section>Newest</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="sortPosts('oldest')">
                <q-item-section>Oldest</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <!-- Post Modal -->
        <q-dialog v-model="showPostModal">
          <q-card style="width: 500px; max-height: 650px;">
            <q-card-section class="bg-green text-white">
              <div class="text-h5 row items-center justify-between">Stray Animal Post
                <q-btn icon="close" flat round dense v-close-popup />
              </div>
            </q-card-section>

            <q-card-section>
              <div class="text-center q-mb-md">
                <q-img v-if="postImage" :src="postImage" style="max-width: 200px; max-height: 200px;" />
              </div>
              <div class="text-center q-mb-md">
                <q-btn color="green" label="Upload Image" @click="openFileInput" class="q-mt-md" />
              </div>
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
                <div class="row no-wrap items-center justify-between">
                  <div class="flex no-wrap items-center">
                    <q-avatar>
                      <img :src="post.user_img" />
                    </q-avatar>
                    <div class="q-ml-sm text-weight-bold">{{ post.author }}</div>
                  </div>
                  <div>
                    <q-btn icon="verified" flat round dense class="verified-icon"></q-btn>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="fixed-height-content">
                <div class="text-h6">{{ post.title }}</div>
                <div class="text-body1 multiline-truncate">{{ post.description }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-dialog v-model="detailsDialog" no-refocus no-focus>
          <q-card class="my-card">
            <q-card-section>
              <q-img v-if="currentPost.image" :src="currentPost.image" />
            </q-card-section>

            <q-card-section class="bg-green text-white">
              <div class="row items-center justify-between">
                <div class="flex no-wrap items-center">
                  <q-avatar>
                    <img :src="currentPost.user_img" />
                  </q-avatar>
                  <div class="q-ml-sm text-h6">{{ currentPost.author }}</div>
                </div>
                <div v-if="currentPost.user_id == userId">
                  <q-btn icon="edit" flat round dense @click="openEditDialog(currentPost)" />
                  <q-btn icon="delete" flat round dense @click="confirmDelete(currentPost)" />
                </div>
              </div>
            </q-card-section>

            <q-card-section class="row items-center justify-between custom-section">
              <div class="text-h6 col">{{ currentPost.title }}</div>
              <q-btn v-if="currentPost.user_id == userId" class="mark-adopted" flat label="Mark Adopted" color="green" @click="markAsAdopted(currentPost)" />
            </q-card-section>

            <q-card-section class="custom-description">
              <div>{{ currentPost.description }}</div>
            </q-card-section>

            <q-card-actions>
              <q-btn color="green" label="Chat" />
              <q-btn color="green" label="Location" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Edit Post Dialog -->
        <q-dialog v-model="showEditDialog">
          <q-card style="width: 500px">
            <q-card-section class="bg-green text-white">
              <div class="text-h6 row items-center justify-between">Edit Post
                <q-btn icon="close" flat round dense v-close-popup />
              </div>
            </q-card-section>
            <q-card-section>
              <!-- Image preview and upload input -->
              <div class="text-center q-mb-md">
                <q-img v-if="editPostImage" :src="editPostImage" style="max-width: 300px; max-height: 300px;" />
              </div>
              <div class="text-center q-mb-md">
                <q-btn color="green" label="Upload Image" @click="openEditFileInput" class="q-mt-md" />
                <!-- Remove hidden attribute and use styles to hide the input -->
                <input type="file" ref="editFileInput" accept="image/*" @change="handleEditFileUpload" style="display: none;" />
              </div>
              <q-input v-model="postToEdit.title" label="Animal's Name" />
              <q-input v-model="postToEdit.description" label="Description" type="textarea" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Cancel" color="black" flat @click="showEditDialog = false" />
              <q-btn label="Save" color="green" @click="editPost" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Delete Confirmation Dialog -->
        <q-dialog v-model="showDeleteConfirmDialog">
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar icon="warning" color="amber" text-color="white" />
              <span class="q-ml-sm">Are you sure you want to delete this post?</span>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Cancel" color="black" flat @click="showDeleteConfirmDialog = false" />
              <q-btn label="Yes, Delete" color="negative" @click="deletePost" />
            </q-card-actions>
          </q-card>
        </q-dialog>


      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
const BASE_IMAGE_URL = 'http://localhost:3000/assets/';
import { useLoginUserStore } from "../stores/loginUserStore";
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
      showEditDialog: false,
      showDeleteConfirmDialog: false,
      editPostImageFile: null,
      editPostImage: null,
      postToEdit: {},
      postToDelete: null,
      loginUserStore: useLoginUserStore(),
    }
  },
  computed: {
    filteredPosts() {
      return this.posts.filter((post) => {
        const searchTermLower = this.searchTerm.toLowerCase()
        return post.adopted === 1 && // Add this line to check for non-adopted animals
        (post.title.toLowerCase().includes(searchTermLower) ||
        post.description.toLowerCase().includes(searchTermLower) ||
        post.author.toLowerCase().includes(searchTermLower));
      })
    },
    userId() {
      return this.loginUserStore.userid;
    },
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click()
    },
    openEditFileInput() {
      this.$refs.editFileInput.click();
    },
    handleFileUpload(event) {
      this.postImageFile = event.target.files[0];
      this.postImage = URL.createObjectURL(this.postImageFile);
    },
    handleEditFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editPostImageFile = file;
        this.editPostImage = URL.createObjectURL(file);
      }
    },
    sortPosts(order) {
      if (order === 'newest') {
        this.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (order === 'oldest') {
        this.posts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
    },
    showDetails(post) {
      console.log('Post user ID:', post.user_id, 'Logged-in user ID:', this.userId);
      this.currentPost = post;
      this.detailsDialog = true;
    },
    async submitPost() {
      try {
        if (!this.postImageFile) {
          throw new Error('Please upload an image.');
        }

        // Set up FormData to send the file
        const formData = new FormData();
        formData.append('singlefile', this.postImageFile);

        // Post the image file to your backend
        const fileResponse = await this.$api.post('/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });

        // Verify that the file upload response is as expected
        if (!fileResponse.data.uploadFileName) {
          throw new Error('File upload did not return a filename.');
        }

        const imageUrl = `${BASE_IMAGE_URL}${fileResponse.data.uploadFileName}`;
        // Now that the file is uploaded, submit the new post with the returned file name
        const postResponse = await this.$api.post('/post/', {
          title: this.animalName,
          description: this.description,
          image: imageUrl, // This should be the path to access the image
          user_id: this.userId, // You need to have the user's id
        });

        this.$q.notify({
          type: 'positive',
          message: 'Post successfully.'
        });

        // Refresh the list after submitting
        await this.getData();

        // Reset the form and close the modal
        this.closePostModal();
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Failed to create post.'
        });
      }
    },
    handlePostButtonClick() {
      if (this.loginUserStore.userid) {
        // If user is logged in, show the post modal
        this.showPostModal = true;
      } else {
        // If user is not logged in, show notification to log in or sign up
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'You must be logged in to post. Please log in or',
          actions: [
            { label: 'Sign Up', color: 'white', handler: () => { this.$router.push('/register'); } }
          ]
        });
      }
    },
    closePostModal() {
      this.showPostModal = false;
      this.postImageFile = null;
      this.postImage = '';
      this.animalName = '';
      this.description = '';
      // Reset the file input if needed
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    async getData() {
      try {
        const response = await this.$api.get('/post/all');
        this.posts = response.data
          .map(post => ({
            ...post,
            author: post.author || 'Unknown',
            description: post.description || 'No description',
            image: post.image && !post.image.startsWith('http') ? `${BASE_IMAGE_URL}${post.image}` : post.image,
            user_id: post.user_id,
            user_img: post.user_img && !post.user_img.startsWith('http') ? `${BASE_IMAGE_URL}${post.user_img}` : post.user_img,
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by latest
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Error fetching posts: ' + error.message
        });
      }
    },
    openEditDialog(post) {
      this.postToEdit = { ...post }; // Make a copy to avoid mutating the original post
      this.editPostImage = post.image;
      this.showEditDialog = true;
    },

    confirmDelete(post) {
      this.postToDeleteId = post.id;
      this.showDeleteConfirmDialog = true;
    },

    async editPost() {
      if (!this.postToEdit.id) {
        this.$q.notify({
          type: 'negative',
          message: 'Post ID is not available.'
        });
        return;
      }
      try {
        // Check if a new image file has been selected
        if (this.editPostImageFile) {
          // Upload the new image first
          const formData = new FormData();
          formData.append('singlefile', this.editPostImageFile);

          const fileResponse = await this.$api.post('/file/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          });

          // Get the new image URL
          const newImageUrl = `${BASE_IMAGE_URL}${fileResponse.data.uploadFileName}`;
          // Update the postToEdit with the new image URL
          this.postToEdit.image = newImageUrl;
        }

        // Update the post details, using Vue.set for reactivity
        const dataToUpdate = {
          title: this.postToEdit.title,
          description: this.postToEdit.description,
          image: this.postToEdit.image,
        };

        await this.$api.put(`/post/${this.postToEdit.id}`, dataToUpdate);

        // Post was updated successfully
        this.$q.notify({
          type: 'positive',
          message: 'Post updated successfully.'
        });
        this.detailsDialog = false;
        this.showEditDialog = false;
        await this.getData(); // Refresh the list
      } catch (error) {
        // Handle errors here
        console.error('Error:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to update post.'
        });
      }
    },

    updatePostWithNewImage() {
      // Proceed to call your API to update the post details
      const dataToUpdate = {
        title: this.postToEdit.title,
        description: this.postToEdit.description,
        image: this.postToEdit.image,
      };

      this.$api.put(`/post/${this.postToEdit.id}`, dataToUpdate)
        .then(() => {
          // Post was updated successfully
          this.$q.notify({
            type: 'positive',
            message: 'Post updated successfully.'
          });
          this.showEditDialog = false;
          this.getData(); // Refresh the list
        })
        .catch(error => {
          // Handle errors here
          console.error('Error updating post:', error);
          this.$q.notify({
            type: 'negative',
            message: 'Failed to update post.'
          });
        });
    },

    deletePost() {
      // Check if we have a valid post ID
      if (!this.postToDeleteId) {
        this.$q.notify({
          type: 'negative',
          message: 'Post ID is not available.'
        });
        return;
      }

      // Perform the API call to delete the post
      this.$api.delete(`/post/${this.postToDeleteId}`)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Post deleted successfully.'
          });
          this.detailsDialog = false;
          this.showDeleteConfirmDialog = false; // Hide the confirmation dialog
          this.postToDeleteId = null; // Reset the postToDeleteId
          this.getData(); // Refresh the list
        }).catch((error) => {
          console.error('Error:', error);
          this.$q.notify({
            type: 'negative',
            message: 'Failed to delete post.'
          });
        });
    },
    markAsAdopted(post) {
      console.log('Marking as adopted:', post.id);
      // You would likely make an API call here to update the post status
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

.mark-adopted {
  padding: 4px 0px;
  margin-left: auto;
}

.custom-section {
  margin-bottom: 0; /* Remove the bottom margin from the title section */
}

.custom-description {
  padding-top: 0; /* Remove the top padding from the description section */
  margin-top: 0; /* Remove the top margin to bring it closer to the title */
}

::v-deep .verified-icon .q-icon {
  font-size: 35px;
}
</style>
