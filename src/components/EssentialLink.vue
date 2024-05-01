<template>
  <div v-if="title != 'Logout'">
    <q-item clickable tag="a" target="_self" :href="link" >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
  <div v-else  @click.prevent="onClick">
    <q-item tag="a" target="_self" :href="link">
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useLoginUserStore } from "../stores/loginUserStore.js";
import { Notify } from "quasar";

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },
    user: {
      type: Boolean,
    },
    admin: {
      type: Boolean,
    },
  },
  data() {
    return {
      storeLogUser: useLoginUserStore(),
    };
  },
  methods: {
    onClick() {
      if (this.title === 'Logout') {
        this.storeLogUser.clearStorage();
        Notify.create({
          type: "info",
          message: "Logout successfully",
        });
        this.$router.push("/").catch(err => {
          console.error('Router push error:', err);
        });
      }
    },
  },
});
</script>
