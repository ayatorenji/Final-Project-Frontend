import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
export const useLoginUserStore = defineStore("loginuser", {
  state: () => ({
    userid: useStorage("userid", ""),
    fullname: useStorage("fullname", ""),
    username: useStorage("username", ""),
    accessToken: useStorage("accessToken", ""),
    userType: useStorage("userType", ""),
    img: useStorage("img", "")
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
    getUserImg: (state) => {
      return state.img
    },
  },
  actions: {
    clearStorage() {
      this.userid = "";
      this.fullname = "";
      this.username = "";
      this.accessToken = "";
      this.userType = "";
      this.img = "";
    },
    setAdminData(adminData) {
      this.userid = adminData.id;
      this.fullname = adminData.fullname;
      this.username = adminData.username;
      this.accessToken = adminData.accessToken;
      this.userType = 'admin';
      if (adminData.img && !adminData.img.startsWith('http')) {
        const encodedImageName = encodeURIComponent(adminData.img); // URL encode the image name
        this.img = `https://firebasestorage.googleapis.com/v0/b/final-project-142d2.appspot.com/o/${encodedImageName}?alt=media`;
      } else {
        // Fallback to a placeholder image
        this.img = adminData.img || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png';
      }
    },
  },
});
