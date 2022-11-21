<template>
  <v-app>
    <v-app-bar
      app
      color="light-green darken-2"
      dark
    >
      <template>
        <v-tabs>
          <v-tab to="/">
            在庫管理
          </v-tab>
          <!-- <v-tab to="/memo">
            購入予定メモ
          </v-tab> -->
        </v-tabs>
      </template>
      <v-spacer></v-spacer>
      <v-btn icon to="/settings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
