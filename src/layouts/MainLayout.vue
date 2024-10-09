<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: brown;">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Stray Animal Care
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
    <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <div v-if="notRegis">
            <EssentialLink
              v-for="link in unregisessentialLinks"
              :key="link.title"
              v-bind="link"
            />
          </div>
          <div v-else-if="isUser">
            <EssentialLink
              v-for="link in useressentialLinks"
              :key="link.title"
              v-bind="link"
              :user="isUser"
              :admin="isAdmin"
              @link-clicked="handleLinkClicked"
            />
          </div>
          <div v-else-if="isAdmin">
            <EssentialLink
              v-for="link in adminessentialLinks"
              :key="link.title"
              v-bind="link"
              :user="isUser"
              :admin="isAdmin"
              @link-clicked="handleLinkClicked"
            />
          </div>
        </q-list>
      </q-scroll-area>
      <q-img
        class="absolute-top"
        src="https://img.freepik.com/free-vector/white-abstract-background_23-2148817571.jpg"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img :src="getIcon" />
          </q-avatar>
          <div class="text-weight-bold" style="color: black;">{{ usernameDisplay }}</div>
          <div class="text-weight-bold" style="color: cornflowerblue;"> <u style="font-size: 12px;">manage account <q-icon name="settings"/></u> </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const BASE_IMAGE_URL = 'http://localhost:3000/assets/';
import { defineComponent, ref, computed } from 'vue';
import EssentialLink from 'components/EssentialLink.vue'
import { useLoginUserStore } from "../stores/loginUserStore.js";

const unregislinksList = [
  {
    title: "Home",
    icon: "home",
    link: "/",
  },
  // {
  //   title: "About Us",
  //   icon: "badge",
  //   // link: "/aboutUs",
  // },
  {
    title: "Animal's Life",
    icon: "pets",
    link: "/pet",
  },
];

const userlinksList = [
  {
    title: "Dashboard",
    icon: "dashboard",
    link: "/dashboard",
  },
  {
    title: "Community",
    icon: "groups",
    link: "/post",
  },
  {
    title: "Animal's Life",
    icon: "pets",
    link: "/pet",
  },
  {
    title: "Map",
    icon: "location_on",
    link: "/map",
  },
  {
    title: "Logout",
    icon: "logout",
  },
];

const adminlinksList = [
  {
    title: "Dashboard",
    icon: "dashboard",
    link: "/dashboard",
  },
  {
    title: "Community",
    icon: "groups",
    link: "/post",
  },
  {
    title: "Animal's Life",
    icon: "pets",
    link: "/pet",
  },
  {
    title: "Map",
    icon: "location_on",
    link: "/map",
  },
  {
    title: "Logout",
    icon: "logout",
  },
];

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },
  setup() {
    const storeLogUser = useLoginUserStore();
    const leftDrawerOpen = ref(false);

    // Computed properties for determining user states
    const notRegis = computed(() => !storeLogUser.userType);
    const isUser = computed(() => storeLogUser.userType === 'user');
    const isAdmin = computed(() => storeLogUser.userType === 'admin');
    const usernameDisplay = computed(() => storeLogUser.fullname || 'Guest');
    const getIcon = computed(() => {
      const imageUrl = storeLogUser.img;
      return imageUrl && !imageUrl.startsWith('http') ? `${BASE_IMAGE_URL}${imageUrl}` : imageUrl || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png';
    });

    function handleLinkClicked(linkTitle) {
      if(linkTitle === 'Logout') {
        storeLogUser.logout();
      }
    }

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      unregisessentialLinks: unregislinksList,
      useressentialLinks: userlinksList,
      adminessentialLinks: adminlinksList,
      notRegis,
      isUser,
      isAdmin,
      usernameDisplay,
      getIcon,
      leftDrawerOpen,
      handleLinkClicked,
      toggleLeftDrawer,
    };
  },
});
</script>
