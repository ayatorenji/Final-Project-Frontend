<template>
  <q-page class="flex flex-center">
    <div class="row ">
      <div class="cursor-pointer">
          <q-btn class="btn btn-primary" label="POST" @click="openDialog"></q-btn>

          <q-dialog v-model="dialog" persistent>
            <q-card>
              <q-card-section>
                <div class="text-h6">Add More Information</div>
              </q-card-section>

              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input v-model="form.name" label="Name" dense autofocus />
                  <q-input v-model="form.description" label="Description" dense type="textarea" />
                  <q-file v-model="form.file" label="Choose an image" dense />
                  <q-select v-model="form.location" :options="locations" label="Choose Location" dense />
                </q-form>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup></q-btn>
                <q-btn flat label="Submit" color="primary" @click="submitForm"></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <div class="search-bar">
            <input type="text" class="form-control" placeholder="Search">
        </div>
        <div class="sort-button">
            <button class="btn btn-secondary">SORT</button>
        </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-6" v-for="animal in animals" :key="animal.title">
        <q-card>
          <q-card-title>
            <div class="text-subtitle1">{{ animal.title }}</div>
            <div class="text-subtitle2">Found around {{ animal.location }}</div>
          </q-card-title>
          <q-card-separator inset />
          <q-card-main>
            <div class="text-caption">{{ animal.description }}</div>
          </q-card-main>
          <q-card-separator inset />
          <q-card-actions>
            <q-btn flat @click="viewDetails(animal)">View Details</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      form: {
        name: '',
        description: '',
        file: null,
        location: '',
      },
      locations: [
        { label: 'Location 1', value: 'location1' },
        { label: 'Location 2', value: 'location2' },
      ],
      animals: [
        {
          title: 'John the cat',
          location: 'Patong beach',
          description: 'Found on Feb 22 2024. He\'s friendly if you want to play with him or want to adopt him please come to Patong ...'
        },
        {
          title: '2 Kitten',
          location: 'Old town',
          description: 'Found on Feb 19 2024. I found 2 little kitten here but I don\'t have time to adopt :('
        },
        {
          title: 'Poor Dog',
          location: 'Wat Chalong Temple',
          description: 'Found on Feb 19 2024. Hey! I find this dog from the entrance of Wat Chalong Temple. I have my own dogs, so I ...'
        },
        {
          title: 'Unknown Dogs',
          location: 'Central Phuket',
          description: 'Found on Feb 15 2024. Many poor dogs :('
        },
        {
          title: 'Kittens',
          location: 'Old town',
          description: 'Found on Jan 30 2024. How cute of them! I want to adopt them but I don\'t have time.'
        },
        {
          title: 'Polar Bear',
          location: 'University',
          description: 'Found on Feb 7 2024. No Description'
        }
      ]
    }
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    submitForm() {
      console.log("Form Submitted", this.form);
      this.dialog = false;
    },
    viewDetails(animal) {
      this.$router.push({ name: 'animal-details', params: { title: animal.title } })
    }
  }
}
</script>
