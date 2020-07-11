<template>
  <div>
    <input type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" ref="fileSelector"/>
    <input type="submit" value="送信" @click="submit" ref="submit"/> 
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

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

      // 1つ目のファイルを取得する
      const file = files[0];

      // 選択されたファイル名を出力
      const filename = file.name;
      console.log(`選択されたファイル名:${filename}`);

      // readerのresultプロパティに、データURLとしてエンコードされたファイルデータを格納
      const reader = new FileReader();
      reader.readAsDataURL(file);
    
      reader.onload = function() {
        console.log( reader.result );
      }

      // Submitイベントをキャンセルする
      return false;
    }
  }
});
</script>

<style scoped>
</style>
