<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="q-pa-md">
        <!-- Post Model -->
        <q-dialog v-model="showSubPostModel">
          <q-card style="width: 500px; max-height: 650px;">
            <q-card-section class="bg-green text-white">
              <div class="text-h5 row items-center justify-between">Update this animal life :D
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
              <q-input v-model="content" label="Description" outlined dense type="textarea" />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn color="green" label="Submit" @click="submitSubPost" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <div v-if="!selectedPost">
          <div class="row justify-between q-mb-md">
            <q-input outlined dense placeholder="Search Bar" class="col-10" v-model="searchTerm" />
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
          
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4" v-for="post in filteredPosts" :key="post.id">
              <q-card @click="showSubPosts(post)" class="my-card">
                <q-img :src="post.image" class="fixed-height-img"/>
                <q-card-section class="bg-green text-white">
                  <div class="row no-wrap items-center justify-between">
                    <div class="flex no-wrap items-center">
                      <q-avatar><img :src="post.user_img" /></q-avatar>
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
        </div>
        
        <!-- Sub-Post View for Selected Post -->
        <div v-else>
          <div class="row justify-between q-mb-md">
            <q-btn label="Back" icon="arrow_back" color="green" @click="selectedPost = null" />
            <q-btn color="green" label="Post" @click="showSubPostModel = true" />
            <q-input outlined dense placeholder="Search Bar" class="col-8" v-model="searchTerm" />
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
          <div class="q-mt-lg text-center text-bold text-lg">Welcome and meet with {{ selectedPost.title }}!</div>
          <div v-if="filteredSubPosts.length > 0" class="row q-col-gutter-md q-mt-lg">
            <div
              v-for="subPost in filteredSubPosts"
              :key="subPost.id"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card class="my-card">
                <q-img :src="subPost.image" class="fixed-height-img" :alt="subPost.content" />
                <q-card-section class="bg-green text-white">
                  <div class="row no-wrap items-center">
                    <q-avatar class="q-mr-sm">
                      <img :src="subPost.userImage" alt="Author Image" />
                    </q-avatar>
                    <div>
                      <div class="text-bold">{{ subPost.fullname }}</div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="fixed-height-content">
                  <div class="text-body1 multiline-truncate">{{ subPost.content }}</div>
                </q-card-section>
                <q-card-actions align="between">
                  <q-btn flat icon="thumb_up" @click="likeSubPost(subPost.id)" class="text-primary">
                    Like ({{ subPost.likes }})
                  </q-btn>
                  <q-btn flat icon="chat_bubble" class="text-primary">
                    Comment
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <div v-else>
            <p class="text-center justify-center q-mt-lg">No one mention about this animal now</p>
          </div>

          <!-- Comment Popup -->
          <q-dialog v-model="showCommentDialog">
            <q-card style="max-width: 600px;">
              <q-card-section>
                <div class="row no-wrap items-center">
                  <q-avatar size="50px" class="q-mr-md">
                    <img :src="selectedSubPost.user_img" alt="Author Image" />
                  </q-avatar>
                  <div>
                    <div class="text-bold">{{ selectedSubPost.author }}</div>
                    <div class="text-caption">{{ formattedDate }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <q-btn
                  flat
                  label="Like"
                  color="primary"
                  icon="thumb_up"
                  @click="likeSubPost(selectedSubPost.id)"
                />
              </q-card-section>

              <q-card-section>
                <div v-if="comments.length > 0">
                  <div v-for="comment in comments" :key="comment.id" class="q-mb-md">
                    <q-avatar size="40px" class="q-mr-md">
                      <img :src="comment.user_img" alt="Comment Author" />
                    </q-avatar>
                    <div>
                      <div class="text-bold">{{ comment.author }}</div>
                      <div class="text-caption">{{ comment.content }}</div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>No comments now</p>
                </div>
              </q-card-section>

              <q-card-section>
                <q-input
                  v-model="newComment"
                  outlined
                  dense
                  placeholder="Type your comment"
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      dense
                      icon="send"
                      @click="submitComment"
                    />
                  </template>
                </q-input>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useLoginUserStore } from "../stores/loginUserStore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase imports
import { storage } from "../firebaseConfig";

const BASE_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/final-project-142d2.appspot.com/o/';

export default {
  data() {
    return {
      currentPost: null,
      detailsDialog: false,
      showSubPostModel: false,
      postImage: null,
      animalName: '',
      description: '',
      searchTerm: '',
      posts: [],
      adoptedPosts: [],
      selectedPost: null,
      subPosts: [],
      newSubPostContent: '',
      newSubPostImage: null,
      showModal: false,
      showCommentDialog: false,
      selectedSubPost: null,
      comments: [],
      newComment: "",
      showEditDialog: false,
      showDeleteConfirmDialog: false,
      postImageFile: null,
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
    filteredSubPosts() {
      const searchTermLower = this.searchTerm.toLowerCase();
      return this.subPosts.filter(subPost => {
        return (
          subPost.content.toLowerCase().includes(searchTermLower) ||
          subPost.fullname.toLowerCase().includes(searchTermLower)
        );
      });
    },
    userId() {
      return this.loginUserStore.userid;
    },
    formattedDate() {
      return new Date(this.selectedSubPost.created_at).toLocaleString();
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
      const file = event.target.files[0];
      if (file) {
        this.postImageFile = file;
        this.postImage = URL.createObjectURL(file);
      }
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
        this.subPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (order === 'oldest') {
        this.posts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        this.subPosts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
    },
    showSubPosts(post) {
      this.selectedPost = post;
      this.fetchSubPosts(post.id);
    },
    async fetchSubPosts(postId) {
      try {
        const response = await this.$api.get(`/post/${postId}/details`);
        this.subPosts = response.data.subPosts
          .map(subPost => ({
            ...subPost,
            likes: subPost.likes || 0  // Ensure likes are initialized properly
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        this.selectedPost = response.data.post;
        this.$forceUpdate(); 
      } catch (error) {
        console.error("Error fetching sub-posts:", error);
        this.$q.notify({ type: "negative", message: "Failed to fetch sub-posts." });
      }
    },
    async likeSubPost(subPostId) {
      console.log("Liking post with ID:", subPostId);
      try {
        const response = await this.$api.put(`/post/sub-posts/${subPostId}/like`);
        const likedSubPost = this.subPosts.find(subPost => subPost.id === subPostId);
        if (likedSubPost) {
            likedSubPost.likes = response.data.likes;
        }
        this.$forceUpdate();
        console.log("Like successful, server response:", response);
      } catch (error) {
        console.error("Error liking sub-post:", error);
        this.$q.notify({ type: "negative", message: "Failed to like sub-post." });
      }
    },
    async editSubPost(subPost) {
      const updatedContent = prompt("Edit your comment:", subPost.content);
      if (updatedContent && updatedContent !== subPost.content) {
        try {
          await this.$api.put(`/post/sub-posts/${subPost.id}/edit`, { content: updatedContent });
          subPost.content = updatedContent;
        } catch (error) {
          console.error("Error editing sub-post:", error);
          this.$q.notify({ type: "negative", message: "Failed to edit sub-post." });
        }
      }
    },
    async deleteSubPost(subPost) {
      if (confirm("Are you sure you want to delete this comment?")) {
        try {
          await this.$api.delete(`/post/sub-posts/${subPost.id}`);
          this.subPosts = this.subPosts.filter(s => s.id !== subPost.id);
        } catch (error) {
          console.error("Error deleting sub-post:", error);
          this.$q.notify({ type: "negative", message: "Failed to delete sub-post." });
        }
      }
    },
    closeSubPosts() {
      this.showSubPosts = false;
      this.subPosts = [];
    },

    async submitSubPost() {
      try {
        if (!this.postImageFile) {
          throw new Error('Please upload an image.');
        }

        // Upload image to Firebase Storage
        const fileRef = ref(storage, `subposts/${Date.now()}-${this.postImageFile.name}`);
        await uploadBytes(fileRef, this.postImageFile);
        const imageUrl = await getDownloadURL(fileRef);

        // Now that the file is uploaded, submit the new post with the returned file name
        const subpostResponse = await this.$api.post(`/post/${this.selectedPost.id}/sub-posts`, {
          post_id: this.selectedPost.id,
          user_id: this.userId, // Need to have the user's id
          content: this.content,
          image: imageUrl, // Firebase image URL
        });

        const newSubPost = subpostResponse.data;

        this.$q.notify({
          type: 'positive',
          message: 'Post successfully.'
        });
        // Refresh the list after submitting
        await this.getData();

        // Reset the form and close the modal
        this.closePostModel();
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Failed to create post.'
        });
      }
    },
    // showSubPostModel() {
    //   if (this.loginUserStore.userid) {
    //     // If user is logged in, show the post modal
    //     this.showSubPostModel = true;
    //   } else {
    //     // If user is not logged in, show notification to log in or sign up
    //     this.$q.notify({
    //       color: 'negative',
    //       position: 'top',
    //       message: 'You must be logged in to post. Please log in or',
    //       actions: [
    //         { label: 'Sign Up', color: 'white', handler: () => { this.$router.push('/register'); } }
    //       ]
    //     });
    //   }
    // },
    closePostModel() {
      this.showSubPostModel = false;
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
            likes: post.likes,
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
    async fetchComments(subPostId) {
      try {
        const response = await this.$api.get(`/api/comments/${subPostId}`);
        this.comments = response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    async openComments(subPost) {
      this.selectedSubPost = subPost;
      this.showCommentDialog = true;
      await this.fetchComments(subPost.id);
    },
    async submitComment() {
      try {
        const response = await this.$api.post(`/api/comments`, {
          sub_post_id: this.selectedSubPost.id,
          user_id: this.userId,
          content: this.newComment,
        });
        this.comments.unshift(response.data);
        this.newComment = "";
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    },
  },
  async mounted() {
    await this.getData();
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
