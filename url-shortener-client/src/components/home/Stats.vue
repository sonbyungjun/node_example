<template>
  <div class="home_stats">
    <h1>URL Stats</h1>
    <ul v-if="stats">
      <li v-for="(item, index) in stats" :key="index">
        <div>시간대 : {{item.at}}</div>
        <div>방문수 : {{item.visits}}</div>
      </li>
    </ul>
    <ul v-else>
      데이터가 존재하지 않습니다.
    </ul>

    <p>
      <router-link :to="`/`">URL Shortener</router-link>
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id : this.$route.params.id,
        stats: null
      };
    },
    created() {
      this.fetch()
    },
    methods: {
      fetch() {
        this.axios
          .get(`/${this.id}/stats`)
          .then(res => {
            if (res.data.stats) {
              this.stats = res.data.stats
            }
          })
          .catch(err => {
            this.$toasted.error('서버에러 개발자에게 문의하세요.')
          })
      }
    }
  }
</script>