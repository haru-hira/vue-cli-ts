<template>
  <div>
    <input type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" ref="fileSelector"/>
    <input type="submit" value="送信" @click="submitUpload"/>
    <input type="submit" value="送信(分割/5MB以上)" @click="submitSplitUpload"/>
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
        const uploadId: string = res.data.uploadId;
        const key: string = res.data.key;
        const partSize = 1024 * 1024 * 5; // 5MB/chunk
        const allSize = file.size;
        
        this.sendDataLoop(allSize, partSize, file, uploadId, key)
        .then((multipartMap) => {
          axios.put('http://localhost:80/document/complete-split-upload/0', {
            uploadId: uploadId,
            key: key,
            multipartUpload: multipartMap
          }).then(() => {
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
              console.log(`progress: ${progress * 100}%`);

              const uploadParams = new FormData();
              uploadParams.append('uploadId', uploadId);
              uploadParams.append('key', key);
              uploadParams.append('partNum', String(value.partNum));
              uploadParams.append('file', value.byte)

              await axios.post(
                'http://localhost:80/document/split-upload',
                uploadParams,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
              )
              .then((res) => {
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
          return multipartMap;
        }
        getPageTitle(allSize, partSize, file, uploadId, key)
        .then((multipartMap) => {
          resolve(multipartMap);
        })
      })
    },
    getSendData(file: File, rangeStart: number, end: number, partNum: number) {
      return new Promise((resolve: (value?: { byte: Blob; partNum: number }) => void) => {
        const splitedBlob = file.slice(rangeStart , end);
        resolve({ byte: splitedBlob, partNum: partNum });
      })
    }
  }
});
</script>

<style scoped>
</style>
