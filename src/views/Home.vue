<template>
  <v-container>
    <draggable
      v-model="items"
      :options="{animation: 150, delay: 0, handle: '.handle'}"
      @end="drag_update"
    >
      <v-col
        v-if="items.length == 0 && !loading"
      >
        <p class="text-center">表示する項目がありません。</p>
      </v-col>
      <v-col
        v-else
        v-for="(item, key) in items"
        :key="key"
        class="pb-0"
      >
        <v-card
          elevation="0"
        >
          <v-row align="center" justify="center">
            <v-col cols=auto class="handle">
              <v-icon>mdi-drag-horizontal</v-icon>
            </v-col>
            <v-col cols=7>
              <p class="mb-0 text-caption">{{ get_gauge(item) }}</p>
              <p class="mb-0">{{ item.name }}</p>
            </v-col>
            <v-col cols=auto>
              <v-row>
                <v-col cols=auto class="pr-0">
                  <v-btn icon @click="edit_item(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols=auto class="pl-0">
                  <v-btn icon @click="delete_item(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <p class="mb-0 text-caption text-center">{{ $dayjs(item.update).format('YYYY-MM-DD') }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </draggable>
    <v-btn
      color="light-green"
      dark
      fixed
      bottom
      right
      fab
      class="mb-15 mr-5"
      @click="add_item"
    >
      <v-icon
        size=32
      >
        mdi-plus
      </v-icon>
    </v-btn>
    <Edit ref="edit" @parentMethod="save_item"></Edit>
    <Confirm ref="confirm"></Confirm>
    <vue-loading
      v-if="loading"
      type="bubbles"
      color="#8BC34A"
      :size="{ width: '50px', height: '50px' }"
      class="mt-5"
    ></vue-loading>
    <v-snackbar
      v-model="snackbar_settings.snackbar"
      color="success"
    >
      <v-row align="center">
        <v-col cols="auto" class="pr-0">
          <v-icon small>mdi-check-circle</v-icon>
        </v-col>
        <v-col cols="auto">
          <p class="mb-0">{{ snackbar_settings.message }}</p>
        </v-col>
      </v-row>
      <template v-slot:action="{ attrs }">
        <v-btn
          icon 
          color="white"
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import Edit from '@/components/Edit.vue'
import Confirm from '@/components/Confirm.vue'
import { VueLoading } from 'vue-loading-template'
import draggable from 'vuedraggable'

export default {
  name: 'Home',

  components: {
    draggable,
    Edit,
    Confirm,
    VueLoading,
  },

  data() {
    return {
      loading: false,
      snackbar_settings: {
        snackbar: false,
        message: '',
      },
      items: [],
    }
  },

  methods: {

    add_item() {
      this.snackbar_settings.snackbar = false
      const new_item = {
        id: '',
        name: '',
        quantity: 0,
        is_using: false,
        update: '',
      }
      this.$refs.edit.open(new_item)
    },
    edit_item(item) {
      this.snackbar_settings.snackbar = false
      this.$refs.edit.open(item)
    },

    save_item(item) {
      if (item.id == '') {
        item.id = this.create_uuid().slice(0, 8)
        this.items.push(item)
        this.snackbar_settings.message = 'データを追加しました。'
        this.snackbar_settings.snackbar = true
      } else {
        const index = this.items.findIndex(e => e.id == item.id)
        this.items[index].name = item.name
        this.items[index].quantity = item.quantity
        this.items[index].is_using = item.is_using
        this.items[index].update = item.update
        this.snackbar_settings.message = 'データを更新しました。'
        this.snackbar_settings.snackbar = true
      }
      this.$gas.update_data(item)
    },
    async delete_item(item) {
      this.snackbar_settings.snackbar = false
      if (await this.$refs.confirm.confirm('「' + item.name + '」を削除しますか？')) {
        this.items = this.items.filter(e => e.id != item.id)
        this.$gas.delete_data(item)
        this.snackbar_settings.message = 'データを削除しました。'
        this.snackbar_settings.snackbar = true
      }
    },
    drag_update() {
      this.$gas.update_list(this.items)
    },

    create_uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (a) => {
        let r = (new Date().getTime() + Math.random() * 16) % 16 | 0, v = a == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    get_gauge(item) {
      let result = '在庫なし';
      if (item.quantity > 0) {
        if (item.is_using) {
          result = '☆';
          result += '★'.repeat(item.quantity - 1);
        } else {
          result = '★'.repeat(item.quantity);
        }
        let star_count = (result.match(/★/g)||[]).length;
        result += '(' + star_count + ')';
      }
      return result;
    },

    async initialize() {
      this.loading = true

      const res = await this.$gas.fetch_data()
      if (res) {
        if (Array.isArray(res.data)) {
          this.items = res.data
        }
        // console.log(this.items)
      }

      this.loading = false
    }
  },
  mounted() {
    console.log('mouted!')
    this.initialize()
  },
}
</script>
