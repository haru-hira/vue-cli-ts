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
            axios.put('http://localhost:80/document/complete-upload/' + res.data.id, {
              isSuccess: true,
              fileName: file.name,
              contentType: file.type
            })
            .then(() => {
              alert("upload: success!");
              return true;
            })
            .catch((e2) => {
              // アップロードできたが通知に失敗した場合
              alert(e2);
              return false
            });
          })
          .catch((e2) => {
            axios.put('http://localhost:80/document/complete-upload/' + res.data.id, {
              isSuccess: false
            })
            .then(() => {
              alert(e2);
              return false;
            })
            .catch((e3) => {
              alert(e3);
              return false
            });
          });
        })
        .catch((e1) => {
          alert(e1);
          return false
        });
      }
    }
  }
});
</script>

<style scoped>
</style>
