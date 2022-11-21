<template>
  <v-container>
    <p>※設定はこのデバイスのみに保存されます。</p>
    <v-form
      v-model="valid"
    >
      <h3>アプリ設定</h3>
      <v-text-field
        label="API URL"
        v-model="api_url"
        color="light-green darken-1"
        :rules="[required]"
      ></v-text-field>
      <v-row justify="end" class="pt-4">
        <v-col cols=auto>
          <v-btn
            color="light-green"
            :disabled="!valid"
            @click="save"
          >
            <p class="mb-0" style="color:#FFF">保存</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-snackbar v-model="is_save" class="mb-5">保存しました。</v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'Settings',

  data() {
    return {
      valid: false,
      api_url: '',
      is_save: false,
      required: value => !!value || "必ず入力してください",
    }
  },

  methods: {
    save() {
      this.is_save = true
      localStorage.setItem('api_url', this.api_url)
    }
  },

  mounted() {
    this.api_url = localStorage.getItem('api_url')
  }
}
</script>