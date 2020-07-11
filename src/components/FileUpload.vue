<template>
  <div>
    <input type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" ref="fileSelector"/>
    <input type="submit" value="送信" @click="submit" ref="submit"/> 
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
  name: 'FileUpload',
  methods: {
    submit() {
      // ファイル要素から、選択されたファイルを取得する
      const files = (this.$refs.fileSelector as InstanceType<typeof HTMLInputElement>).files;

      // ファイルが選択されていなかったら終了
      if (!files || files.length === 0) {
        console.log("ファイルが選択されていません");
        return false;
      }

      // 1つ目のファイルを取得する(非multiple)
      const file = files[0];

      // readerのresultプロパティに、データURLとしてエンコードされたファイルデータを格納
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        // 前提1: Gitプロジェクト"nest-typeorm"をローカルで起動
        axios.get('http://localhost:80/document/init-upload')
        .then((res) => {
          axios.put(res.data.s3PresignedURL, file, {
            headers: {
              'Content-Type': file.type,
            }
          })
          .then(() => {
            alert("upload: success!");
            return true;
          })
          .catch((e) => {
            alert(e);
            return false;
          });
        })
        .catch((e) => {
          alert(e);
          return false
        });
      }
    }
  }
});
</script>

<style scoped>
</style>
