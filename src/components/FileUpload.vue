<template>
  <v-container class="blue lighten-5">
    <v-row class="blue lighten-4" justify="center">
      <v-col class="blue lighten-3">
        <v-file-input label="File input" @change="getFileContent"></v-file-input>
      </v-col>
      <v-col class="blue lighten-2">
        <v-btn @click="submitUpload">送信(5MB以上は分割送信)</v-btn>
      </v-col>
    </v-row>
    <v-row class="blue lighten-3" justify="center">
      <v-col class="blue lighten-2">
        <v-text-field label="文書ID" v-model="selectedId"></v-text-field>
      </v-col>
      <v-col class="blue lighten-4">
        <v-btn @click="download">ダウンロード</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import FileType from 'file-type/browser';

const partSize = 1024 * 1024 * 5; // 5MB/chunk
export default Vue.extend({
  name: 'FileUpload',
  data(): {
    selectedFile: File | null;
    selectedId: number | null;
  } {
    return {
      selectedFile: null,
      selectedId: null
    }
  },
  methods: {
    getFileContent(file: File): void {
      this.selectedFile = file;
    },
    submitUpload() {
      if (!this.selectedFile) {
        return;
      }
      const file = this.selectedFile;

      // 1. 非分割送信
      if (file.size < partSize) {
        const contentType = file.type ? file.type : 'application/octet-stream';
        // 前提1: Gitプロジェクト"nest-typeorm"をローカルで起動
        axios.get('http://localhost:80/document/init-upload')
        .then((res) => {
          axios.put(res.data.s3PresignedURL, file, {
            headers: {
              'Content-Type': contentType,
            }
          }).then(() => {
            axios.put('http://localhost:80/document/complete-upload/' + res.data.id, {
              isSuccess: true,
              fileName: file.name,
              contentType: contentType
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
      if (!this.selectedId || this.selectedId < 1) {
        return;
      }
      const id = this.selectedId;
      let fileName = 'unknown.file';
      let contentType = '';
      axios.get('http://localhost:80/document/' + id)
      .then((res1) => {
        fileName = res1.data.fileName;
        contentType = res1.data.contentType ? res1.data.contentType : 'application/octet-stream';
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
          const url = URL.createObjectURL(new Blob([res2.data], { type: contentType }));
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
