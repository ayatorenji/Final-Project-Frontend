import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
export const useLoginUserStore = defineStore("loginuser", {
  state: () => ({
    userid: useStorage("userid", ""),
    fullname: useStorage("fullname", ""),
    username: useStorage("username", ""),
    accessToken: useStorage("accessToken", ""),
    userType: useStorage("userType", ""),
  }),
  getters: {
    getFullname: (state) => {
      return state.fullname;
    },
    getUserid: (state) => {
      return state.userid;
    },
    getUsername: (state) => {
      return state.username;
    },
    getAccessToken: (state) => {
      return state.accessToken;
    },
    getUserType: (state) => {
      return state.userType;
    },
  },
  actions: {
    clearStorage() {
      this.userid = "";
      this.fullname = "";
      this.username = "";
      this.accessToken = "";
      this.userType = ""
    },
    setAdminData(adminData) {
      this.userid = adminData.id;
      this.fullname = adminData.fullname;
      this.username = adminData.username;
      this.accessToken = adminData.accessToken;
      this.userType = 'admin';
    },
  },
});
