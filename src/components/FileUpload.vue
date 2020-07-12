<template>
  <div>
    <input type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" ref="fileSelector"/>
    <input type="submit" value="送信" @click="submitUpload"/>
    <input type="submit" value="送信(分割)" @click="submitSplitUpload"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
  name: 'FileUpload',
  methods: {
    submitUpload() {
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
          }).then(() => {
            axios.put('http://localhost:80/document/complete-upload/' + res.data.id, {
              isSuccess: true,
              fileName: file.name,
              contentType: file.type
            }).then(() => {
              alert("upload: success!");
              return true;
            }).catch((e2) => {
              // アップロードできたが通知に失敗した場合
              alert(e2);
              return false
            });
          }).catch((e2) => {
            axios.put('http://localhost:80/document/complete-upload/' + res.data.id, {
              isSuccess: false
            }).then(() => {
              alert(e2);
              return false;
            }).catch((e3) => {
              alert(e3);
              return false
            });
          });
        }).catch((e1) => {
          alert(e1);
          return false
        });
      }
    },
    submitSplitUpload() {
      console.log("File: " + window.File)
      console.log("FileReader: " + window.FileReader)
      console.log("FileList: " + window.FileList)
      console.log("Blob: " + window.Blob)

      // ファイル要素から、選択されたファイルを取得する
      const files = (this.$refs.fileSelector as InstanceType<typeof HTMLInputElement>).files;

      // ファイルが選択されていなかったら終了
      if (!files || files.length === 0) {
        console.log("ファイルが選択されていません");
        return false;
      }

      // 1つ目のファイルを取得する(非multiple)
      const file = files[0];

      // 前提1: Gitプロジェクト"nest-typeorm"をローカルで起動
      axios.get('http://localhost:80/document/init-split-upload')
      .then((res) => {
        console.log("log: 1.success");
        const uploadId: string = res.data.uploadId;
        const key: string = res.data.key;
        console.log("log: 1.uploadId:" + uploadId);
        console.log("log: 1.key:" + key);
        const partSize = 1024 * 1024 * 5; // 5MB/chunk
        const allSize = file.size;
        
        this.sendDataLoop(allSize, partSize, file, uploadId, key)
        .then((multipartMap) => {
          axios.put('http://localhost:80/document/complete-split-upload/0', {
            uploadId: uploadId,
            key: key,
            multipartUpload: multipartMap
          }).then(() => {
            console.log("log: 3.success");
            alert("split upload success!!");
            return true;
          }).catch((e3) => {
            alert(e3);
            return false;
          });
        })
        .catch((e2) => {
          alert(e2);
          return false;
        });
      }).catch((e1) => {
        alert(e1);
        return false
      });
    },
    sendDataLoop(allSize: number, partSize: number, file: File, uploadId: string, key: string) {
      return new Promise((resolve: (value?: { Parts: { ETag: string; PartNumber: number }[] }) => void) => {
        const getPageTitle = async (allSize: number, partSize: number, file: File, uploadId: string, key: string) => {
          const multipartMap: {
            Parts: { ETag: string; PartNumber: number }[];
          } = { Parts: [] }
          let partNum = 0;
          for (let rangeStart = 0; rangeStart < allSize; rangeStart += partSize) {
            partNum++;
            const end = Math.min(rangeStart + partSize, allSize);
            
            await this.getSendData(file, rangeStart, end, partNum)
            .then(async (value) => {
              const progress = end / file.size;
              console.log(`今,${progress * 100}%だよ`);

              const uploadParams = new URLSearchParams();
              uploadParams.append('uploadId', uploadId);
              uploadParams.append('key', key);
              uploadParams.append('partNum', String(value.partNum));
              uploadParams.append('sendData', String(value.byte));
              await axios.post('http://localhost:80/document/split-upload', uploadParams)
              .then((res) => {
                console.log("log: 2.success/ETag:" + res.data.ETag);
                multipartMap.Parts.push({
                  ETag: res.data.ETag,
                  PartNumber: res.data.PartNumber
                });
                return;
              }).catch((e3) => {
                alert(e3);
                return false;
              });
            })
            .catch((e2) => {
              alert(e2);
              return false;
            });
          }
          console.log("log: 2*.sendDataLoop inner finish!");
          return multipartMap;
        }
        getPageTitle(allSize, partSize, file, uploadId, key)
        .then((multipartMap) => {
          console.log("log: 2*.sendDataLoop finish!");
          resolve(multipartMap);
        })
      })
    },
    getSendData(file: File, rangeStart: number, end: number, partNum: number) {
      return new Promise((resolve: (value?: { byte: Uint8Array; partNum: number }) => void) => {
        console.log("log: getSendData()");
        const fileReader =  new FileReader();

        fileReader.onload = (event) => {
          console.log("log: getSendData().onload");
          const data = event.target?.result;
          let byte: Uint8Array;
          if (data) {
            if (data instanceof ArrayBuffer) {
              byte = new Uint8Array(data);
              resolve({ byte: byte, partNum: partNum });
            } else {
              byte = (new TextEncoder).encode(data);
              resolve({ byte: byte, partNum: partNum });
            }
          }
          fileReader.abort();
        };
        const splitedBlob = file.slice(rangeStart , end);
        fileReader.readAsArrayBuffer(splitedBlob);
      })
    }
  }
});
</script>

<style scoped>
</style>
