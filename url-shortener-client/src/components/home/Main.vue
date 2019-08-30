<template>
  <div class="home_main">
    <h1>URL Shortener</h1>
    <input type="text" v-model="url" placeholder="input url....">
    <button @click="onClickShorener">submit</button>

    <div v-if="shortUrl">
      <h3>Result</h3>
      <p>
        <b>original-url : <a target="_blank" :href="originUrl">{{originUrl}}</a></b>
      </p>
      <p>
        <b>short-url : <a target="_blank" :href="shortUrl">{{shortUrl}}</a></b>
      </p>
      <p>
        <b>Stats : <router-link :to="`${urlId}/stats`">통계보기</router-link></b>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        url : '',
        shortUrl : '',
        urlId : '',
        originUrl : ''
      }
    },
    methods : {
      onClickShorener() {
        if (this.url.length < 1) {
          return this.$toasted.show('URL을 입력하세요.')
        }
        if (!(this.url.indexOf("http://") == 0 || this.url.indexOf("https://") == 0)) {
          return this.$toasted.show('URL형식을 확인하세요.')
        }
        this.shortUrl = ''
        this.urlId = ''
        this.originUrl = ''
        this.axios
          .post(`/register?url=${this.url}`)
          .then(res => {
            if (res.data.url) {
              this.$toasted.show('URL 축약 성공!')
              this.shortUrl = res.data.url
              this.urlId = res.data.id
              this.originUrl = this.url
              this.url = '';
            }
          })
          .catch(err => {
            this.$toasted.show('서버에러 개발자에게 문의하세요.')
          })
      }
    }
  }
</script>
