<template>
  <v-dialog
    v-model="show_confirm"
    persistent
    max-width="380"
  >
    <v-card>
      <v-card-title class="text-h6 text-weight-black">
        <v-icon class="mr-3" color="red">mdi-alert</v-icon>
        <p class="mb-0 text-subtitle-1">{{ message }}</p> 
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="$emit('answer', false)"
        >
          いいえ
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="$emit('answer', true)"
        >
          はい
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Confirm',

  data() {
    return {
      show_confirm: false,
      message: '',
    }
  },

  methods: {
    confirm(message) {
      this.message = message
      this.show_confirm = true
      return new Promise(resolve => {
        this.$once('answer', confirm_value => {
          this.show_confirm = false
          resolve(confirm_value)
        })
      })
    },
  }
}
</script>