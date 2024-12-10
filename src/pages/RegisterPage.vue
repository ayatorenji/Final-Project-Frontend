<template>
  <q-page>
    <div style="text-align: center">
      <h2>Register</h2>
    </div>
    <div class="flex justify-center">
      <q-card class="my-card bg-grey-1 q-px-md q-py-md" style="width: 25rem">
        <div class="flex flex-center" v-if="!imageUrl">
          <q-icon name="account_circle" color="grey-6" size="4rem" />
        </div>
        <div v-else>
          <q-img
            :src="imageUrl"
            :ratio="4 / 3"
            spinner-color="primary"
            spinner-size="82px"
          />
        </div>
        <q-card-section>
          <q-form
            @submit.prevent="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
            ref="myRegisterForm"
          >
            <div>
              <q-input
                v-model="fullname"
                type="text"
                label="Your Fullname"
                lazy-rules
                :rules="[requiredValidate]"
              />
            </div>
            <div>
              <q-input
                v-model="email"
                type="text"
                label="Your Email"
                lazy-rules
                :rules="[emailValidate, requiredValidate]"
              />
            </div>
            <div>
              <q-input
                v-model="username"
                type="text"
                label="Your username"
                lazy-rules
                :rules="[requiredValidate]"
              />
              <text-caption
                style="font-size: 0.9em"
                v-if="usernameCaption.show"
                :class="[
                  usernameCaption.showClass ? 'text-positive' : 'text-negative',
                ]"
              >
                <q-icon :name="usernameCaption.icon" size="1.5em" />
                {{ usernameCaption.msg }}
              </text-caption>
            </div>
            <div>
              <q-input
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                label="Your Password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length >= 6) || 'Must be at least 6 characters',
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <div>
              <!-- file size = 1MB -->
              <q-file
                outlined
                label="Your image profile"
                v-model="upload_avatar"
                accept=".jpg, .jpeg, .png"
                max-file-size="1048576"
                @rejected="onRejected"
                @update:model-value="updateFile()"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { emailValidate, requiredValidate } from "../utils/validations";
import { useLoginUserStore } from "../stores/loginUserStore.js";
import { Notify } from "quasar";
import debounce from 'lodash/debounce';
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase imports
const BASE_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/final-project-142d2.appspot.com/o/';

export default defineComponent({
  name: "RegisterPage",
  data() {
    return {
      fullname: null,
      email: null,
      username: null,
      password: null,
      isPwd: true,
      upload_avatar: null,
      isShowIcon: true,
      imageUrl: "",
      usernameCaption: {
        showStatus: false,
        showClass: false,
        icon: null,
        msg: null,
      },
      storeLogUser: useLoginUserStore(),
    };
  },
  methods: {
    emailValidate,
    requiredValidate,
    onRejected(rejectedEntries) {
      rejectedEntries.forEach(entry => {
        let msg;
        if (entry.failedPropValidation == "accept")
          msg = "Only images (jpg, jpeg, png) are allowed";
        else if (entry.failedPropValidation == "max-file-size")
          msg = "File size cannot be larger than 1MB";
        Notify.create({
          type: "negative",
          message: msg,
        });
      });
    },
    updateFile() {
      this.isShowIcon = false;
      this.imageUrl = URL.createObjectURL(this.upload_avatar);
    },
    async onSubmit() {
      let avatarUrl = null;
      if (this.upload_avatar) {
        try {
          // Firebase file upload
          const storageRef = ref(storage, `avatars/${Date.now()}-${this.upload_avatar.name}`);
          const uploadResult = await uploadBytes(storageRef, this.upload_avatar);
          avatarUrl = await getDownloadURL(uploadResult.ref);
        } catch (err) {
          console.error(err);
          Notify.create({
            type: "negative",
            message: "File upload failed.",
          });
          return;
        }
      }
      if (this.upload_avatar && !['image/jpeg', 'image/png', 'image/jpg'].includes(this.upload_avatar.type)) {
        Notify.create({
          type: 'negative',
          message: 'Invalid image type. Only jpg, jpeg, png are allowed.',
        });
        return;
      }
      // Proceed with user registration after file upload
      this.submitData(avatarUrl);
    },

    submitData(avatarUrl){
      const data = {
        fullname: this.fullname,
        email: this.email,
        username: this.username,
        password: this.password,
        img: avatarUrl || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png", // Fallback to default avatar if no upload
      }
      if (!this.usernameCaption.showClass) {
        Notify.create({
          type: "negative",
          message: "Username is already taken",
        });
        return;
      }
      this.$api.post("/auth/signup", data)
        .then((response) => {
          if (response && response.data) {
            this.storeLogUser.userid = response.data.id;
            this.storeLogUser.fullname = response.data.fullname;
            this.storeLogUser.username = response.data.username;
            this.storeLogUser.accessToken = response.data.accessToken;
            this.storeLogUser.userType = 'user'
            this.storeLogUser.img  = avatarUrl || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

            Notify.create({
              color: 'positive',
              message: 'Registration successful'
            });

            this.$router.push('/post');
          } else {
            throw new Error('Invalid response from server');
          }
        })
        .catch((error) => {
          console.error(error);
          Notify.create({
            color: 'negative',
            message: `Registration failed: ${error.message}`
          });
        })
        .finally(() => {
          this.onReset();
        });
    },
    onReset() {
      this.fullname = null;
      this.email = null;
      this.username = null;
      this.password = null;
      this.resetUserCaption();
      this.upload_avatar = null;
      this.imageUrl = "";
    },
    resetUserCaption() {
      this.usernameCaption.show = false;
      this.usernameCaption.showClass = false;
      this.usernameCaption.icon = null;
      this.usernameCaption.msg = null;
    },
    usernameValidate: debounce(function() {
      if (this.username) {
        this.$api
          .get("/auth/" + this.username)
          .then((response) => {
            // console.log(response.data)
            if (response.data.valid) {
              this.usernameCaption.show = true;
              this.usernameCaption.showClass = true;
              this.usernameCaption.icon = "check_circle_outline";
              this.usernameCaption.msg = "This username is Available.";
            } else {
              this.usernameCaption.show = true;
              this.usernameCaption.showClass = false;
              this.usernameCaption.icon = "highlight_off";
              this.usernameCaption.msg = "This username is NOT Available.";
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.resetUserCaption();
      }
    }, 300),
  },
  watch: {
    username() {
      this.usernameValidate();
    },
  },
});
</script>
