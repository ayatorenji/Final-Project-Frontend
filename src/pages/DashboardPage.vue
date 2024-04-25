<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="row q-mb-md">
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="row items-center no-wrap">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
                <div class="q-ml-sm">
                  <div class="text-weight-bold">Chayanon Rokeaw</div>
                  <div class="text-grey">The kitty lover</div>
                  <q-rating v-model="userRating" :max="5" size="sm" readonly />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Your Pets</div>
              <div class="text-h4 q-mt-sm">1 <q-icon name="pets" /></div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Total Animal Adopted</div>
              <div class="text-h4 q-mt-sm">5 <q-icon name="paw" /></div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card>
        <q-card-section>
          <div class="text-h6">Your Post</div>
          <q-list>
            <q-item v-for="post in posts" :key="post.id">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="post.image">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ post.title }}</q-item-label>
                <q-item-label caption>{{ post.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Other sections for interactions, highest rating, etc. -->
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      userRating: 4,
      posts: [
        {
          id: 1,
          title: 'Kittens - Maths - Near University',
          date: 'Found on Feb 25 2024',
          image: 'https://cdn.quasar.dev/img/kittens.jpg'
        },
        {
          id: 2,
          title: 'Cat - Patsing - Near Beach',
          date: 'Found on Feb 22 2024',
          image: 'https://cdn.quasar.dev/img/cat.jpg'
        },
        {
          id: 3,
          title: 'Dog - Near Central Phuket',
          date: 'Found on Feb 15 2024',
          image: 'https://cdn.quasar.dev/img/puppy.jpg'
        },
        {
          id: 4,
          title: 'Puppy - Near Central Phuket',
          date: 'Found on Feb 05 2024',
          image: 'https://cdn.quasar.dev/img/dog.jpg'
        }
      ]
    }
  }
}
</script>
