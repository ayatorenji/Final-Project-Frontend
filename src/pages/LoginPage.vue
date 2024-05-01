<template>
  <q-page>
    <div style="text-align: center">
      <h2>User login</h2>
    </div>
    <div class="flex justify-center">
      <q-card class="my-card bg-grey-1 q-px-xl q-py-xl" style="width: 25rem">
        <div class="flex flex-center">
          <q-icon name="account_circle" color="grey-6" size="4rem" />
        </div>
        <q-card-section>
          <q-form
            @submit.prevent="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
            ref="myLoginForm"
          >
            <div>
              <q-input
                v-model="username"
                type="text"
                label="Your Username"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Must be at least 1 character!',
                ]"
              />
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
                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <div>
              <q-btn
                label="Submit"
                type="submit"
                color="primary"
                style="width: 100%"
              />
            </div>
            <div>
              <text-caption class="text-cyan-8">
                Not registered?
                <a href="/register">Create an Account</a>
              </text-caption>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { Notify } from "quasar";
import { useLoginUserStore } from "../stores/loginUserStore";
export default {
  name: "LoginPage",
  data() {
    return {
      username: null,
      password: null,
      isPwd: true,
      storeLogUser: useLoginUserStore(),
    };
  },
  methods: {
    onReset() {
      this.username = null;
      this.password = null;
      this.isPwd = true;
    },
    onSubmit() {
      const data = {
        username: this.username,
        password: this.password
      }
      this.$api
      .post("/auth/login", data)
      .then((res) => {
        if(res.status == 200){
          // console.log(res.data)
          Notify.create({
            type: "positive",
            message: "Login successfully."
          })
          this.storeLogUser.userid = res.data.id
          this.storeLogUser.fullname = res.data.fullname
          this.storeLogUser.username = res.data.username
          this.storeLogUser.accessToken = res.data.accessToken
          if(this.storeLogUser.username === 'jay'){
            this.storeLogUser.userType = 'admin'
          }
          else{
            this.storeLogUser.userType = 'user'
          }
          this.storeLogUser.img = res.data.img
          this.$router.push("/dashboard")
        }
      })
      .catch((err)=>{
        console.log(err)
        Notify.create({
          type: "negative",
          message: "Invalid Username or Password."
        });
      });
      this.$refs.myLoginForm.reset();
    },
  },
};
</script>
