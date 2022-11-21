<template>
  <v-dialog
    v-model="show_edit"
    persistent
    max-width="400"
  >
    <v-card>
      <v-form ref="form" v-model="valid">
        <v-card-title>{{ title }}</v-card-title>

        <v-divider></v-divider>

        <v-card-text
          class="mt-5"
        >
          <v-row align="center">
            <v-col cols=6>
              <p class="mb-0 text-caption">在庫数</p>
              <p class="mb-0">{{ get_gauge(item) }}</p>
            </v-col>
            <v-col cols=6>
              <v-row align="center" justify="end">
                <v-col cols=auto class="pr-0">
                  <v-btn icon @click="item.quantity = Math.max(item.quantity-1, MIN_QUANTITY)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols=4>
                  <p class="mb-0 text-center">{{ item.quantity }}</p>
                </v-col>
                <v-col cols=auto class="pl-0">
                  <v-btn icon @click="item.quantity = Math.min(item.quantity+1, MAX_QUANTITY)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-text-field
            v-model="item.name"
            label="項目名"
            class="mt-5"
            color="light-green darken-1"
            :rules="[required]"
          ></v-text-field>

          <v-checkbox
            v-model="item.is_using"
            label="使用中"
            color="light-green"
          ></v-checkbox>
        </v-card-text>
        
        <v-card-actions class="justify-end pt-4">
          <v-btn
            color="light-green darken-3"
            text
            @click="close(true)"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="light-green darken-3"
            text
            @click="save"
          >
            {{ button_label }}
          </v-btn>
        </v-card-actions>        
      </v-form>
    </v-card>
    <Confirm ref="confirm"></Confirm>
  </v-dialog>
</template>

<script>
import Confirm from '@/components/Confirm.vue'

export default {
  name: 'Edit',

  components: {
    Confirm
  },

  data() {
    return {
      show_edit: false,
      title: '',
      button_label: '',
      valid: true,
      item: {
        id: '',
        name: null,
        quantity: 0,
        is_using: false,
        update: null,
      },
      initial_name: null,
      initial_quantity: null,
      initial_is_using: null,
      required: value => !!value || "必ず入力してください",
    }
  },

  computed: {
    MAX_QUANTITY: () => 99,
    MIN_QUANTITY: () => 0,
  },

  methods: {
    open(item) {
      this.show_edit = true
      if (item.name == "") {
        this.title = "データ追加"
        this.button_label = "追加"
      } else {
        this.title = "データ編集"
        this.button_label = "更新"
      }
      this.item = JSON.parse(JSON.stringify(item))
      this.initial_name = this.item.name
      this.initial_quantity = this.item.quantity
      this.initial_is_using = this.item.is_using
      // dialogが生成される前に中のformを参照するとエラーになるため
      if (this.$refs.form) { 
        this.$refs.form.resetValidation()
      }
    },

    save() {
      if (this.$refs.form.validate()) {
        this.item.update = this.$dayjs().format('YYYY-MM-DD')
        this.$emit("parentMethod", this.item)
        this.show_edit = false
      }
    },
    async close() {
      if (this.is_change()) {
        if (await this.$refs.confirm.confirm('変更を破棄しますか？')) {
          this.show_edit = false
        }
      } else {
        this.show_edit = false
      }
    },
    is_change() {
      let result = false
      if ((this.item.name != this.initial_name) ||
          (this.item.quantity != this.initial_quantity) ||
          (this.item.is_using != this.initial_is_using)) {
        result = true
      }
      return result
    },

    get_gauge(item) {
      let result = "在庫なし";
      if (item.quantity > 0) {
        if (item.is_using) {
          result = "☆";
          result += "★".repeat(item.quantity - 1);
        } else {
          result = "★".repeat(item.quantity);
        }
      }
      return result;
    },
  }
}
</script>
