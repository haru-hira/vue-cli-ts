<template>
  <div>
    <div>
      <input type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" ref="fileSelector"/>
      <input type="submit" value="送信(5MB以上は分割送信)" @click="submitUpload"/>
    </div>
    <div>
      <input type="text" ref="idField"/>
      <input type="submit" value="ダウンロード" @click="download"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import FileType from 'file-type/browser';

const partSize = 1024 * 1024 * 5; // 5MB/chunk
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

      // 1. 非分割送信
      if (file.size < partSize) {
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
              alert("upload: success! id:" + res.data.id);
              return true;
            });
          }).catch((e2) => {
            axios.put('http://localhost:80/document/complete-upload/' + res.data.id, {
              isSuccess: false
            }).then(() => {
              alert(e2);
              return false;
            });
          });
        }).catch((e) => {
          alert(e);
          return false
        });
      // 2. 分割送信
      } else {
        let id = '';
        FileType.fromBlob(file)
        .then((fileType) => {
          return fileType ? fileType.mime : 'application/octet-stream';
        }).then((contentType) => {
        // 前提1: Gitプロジェクト"nest-typeorm"をローカルで起動
          return axios.post('http://localhost:80/document/init-split-upload', {
            contentType: contentType
          });
        }).then(async (res) => {
          const uploadId: string = res.data.uploadId;
          const key: string = res.data.key;
          const allSize = file.size;
          id = res.data.id;
          
          const multipartMap: {
            Parts: { ETag: string; PartNumber: number }[];
          } = { Parts: [] };
          let partNum = 0;
          for (let rangeStart = 0; rangeStart < allSize; rangeStart += partSize) {
            partNum++;
            const end = Math.min(rangeStart + partSize, allSize);
            const splitFile = file.slice(rangeStart , end);
            const uploadParams = new FormData();
            uploadParams.append('uploadId', uploadId);
            uploadParams.append('key', key);
            uploadParams.append('partNum', String(partNum));
            uploadParams.append('splitFile', splitFile);

            await axios.post(
              'http://localhost:80/document/split-upload',
              uploadParams,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            ).then((res) => {
              multipartMap.Parts.push({
                ETag: res.data.ETag,
                PartNumber: res.data.PartNumber
              });
              const progress = end / file.size;
              console.log(`progress: ${progress * 100}%`);
              return;
            });
          }
          return axios.put(
            'http://localhost:80/document/complete-split-upload/' + id,
            {
              isSuccess: true,
              uploadId: uploadId,
              key: key,
              multipartUpload: multipartMap,
              fileName: file.name,
            }
          );
        }).then(() => {
          alert("split upload success!! id:" + id);
          return true;
        }).catch((e) => {
          alert(e);
          return false
        });
      }
    },
    download(): void {
      const id = (this.$refs.idField as InstanceType<typeof HTMLInputElement>).value;
      let fileName = 'unknown.file';
      axios.get('http://localhost:80/document/' + id)
      .then((res1) => {
        fileName = res1.data.fileName;
        return axios.get(res1.data.s3PresignedURL, {
          responseType: 'blob',
          headers: { Accept: res1.data.contentType },
        });
      }).then((res2) => {
        if (window.navigator.msSaveOrOpenBlob) {
          // for IE/Edge
          window.navigator.msSaveOrOpenBlob(res2.data, fileName);
        } else {
          // for chrome/firefox
          const url = URL.createObjectURL(new Blob([res2.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(url);
        }
        return;
      });
    }
  }
});
</script>

<style scoped>
</style>
