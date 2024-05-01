<template>
  <q-page>
    <div style="text-align: center">
      <h2>Register</h2>
    </div>
    <div class="flex justify-center">
      <q-card class="my-card bg-grey-1 q-px-md q-py-md" style="width: 25rem">
        <div class="flex flex-center" v-if="isShowIcon">
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
      let msg;
      if (rejectedEntries[0].failedPropValidation == "accept")
        msg = "Only images (jpg, jpeg, png) are allowed";
      else if (rejectedEntries[0].failedPropValidation == "max-file-size")
        msg = "File size cannot be larger than 1MB";
      Notify.create({
          type: "negative",
          message: msg,
      });
    },
    updateFile() {
      this.isShowIcon = false;
      this.imageUrl = URL.createObjectURL(this.upload_avatar);
    },
    onSubmit() {
      if (this.upload_avatar == "")
        this.upload_avatar = null;
      if (this.upload_avatar) {
        //call upload file API
        const headers = {
          "Content-Type": "multipart/form-data"
        }
        const formData = new FormData();
        formData.append("singlefile", this.upload_avatar);
        this.$api.post("/file/upload", formData, {headers})
        .then((response)=>{
          if(response.status == 200){
            // call user registration API
            this.submitData(response.data.uploadFileName)
           }
        })
        .catch((err) => {
            console.log(err);
            this.showErrorDialog(err);
        });
      }else {
        //not call upload file API
        // call user registration API
        this.submitData(null);
      }
    },

    submitData(filename){
      const data = {
        fullname: this.fullname,
        email: this.email,
        username: this.username,
        password: this.password,
        img: filename,
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
            if(response.data.img != null){
              this.storeLogUser.avatar = this.$RESTAPI + "/file/" + response.data.img;
            } else{
              this.storeLogUser.avatar = "default-avatar.png";
            }

            this.storeLogUser.img = response.data.img

            Notify.create({
              color: 'positive',
              message: 'Registration successful'
            });

            this.$router.push('/dashboard');
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
      this.upload_avatar = null;
      this.imageUrl = "";
    },
    resetUserCaption() {
      this.usernameCaption.show = false;
      this.usernameCaption.showClass = false;
      this.usernameCaption.icon = null;
      this.usernameCaption.msg = null;
    },
    usernameValidate() {
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
    },
  },
  watch: {
    username() {
      this.usernameValidate();
    },
  },
});
</script>
