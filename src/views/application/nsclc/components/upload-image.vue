<template>
  <div id="upload" style=" width: 100%;">
    <el-row justify="center">
      <el-col :span="24">
        <el-card class="mx-auto" shadow="hover">
          <el-row type="flex" justify="center" align="middle" style="padding-top: 12px;">
            <el-col class="title" type="flex" justify="center" align="middle">
              <h2>上传ct图像</h2>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" align="middle" style="padding-top: 12px;">
            <el-col style="width: 30%" class="title" type="flex" justify="center" align="middle">
              <el-upload
                ref="upload"
                class="upload-demo"
                action="string"
                :http-request="UploadImage"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :on-change="handleImageChange"
                :file-list="fileDataImage"
              >
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              </el-upload>
            </el-col>
            <el-col style="width: 30%" class="title" type="flex" justify="center" align="middle">
              <el-button :disabled="showNrrdBtn" size="small" type="primary" @click="shownrrd">查看影像</el-button>
            </el-col>
          </el-row>
          <el-divider />

          <el-row type="flex" justify="center" align="middle" style="padding-top: 12px;">
            <el-col class="title" type="flex" justify="center" align="middle">
              <h2>上传掩膜图像</h2>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center" align="middle" style="padding-top: 12px;">
            <el-col class="title" type="flex" justify="center" align="middle">
              <el-upload
                ref="upload"
                class="upload-demo"
                action="string"
                :http-request="UploadMask"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :on-change="handleMaskChange"
                :file-list="fileDataMask"
              >
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-divider />
          <el-divider />
          <el-row justify="center" />

          <el-col />

          <el-row type="flex" justify="center" align="middle">
            <el-col :span="20" style="width: 30%">
              <el-select
                v-model="diagnosis.modelCode"
                placeholder="请选择模型"
                clearable
              >
                <el-option
                  v-for="item in models"
                  :key="item.modelCode"
                  :label="item.modelName"
                  :value="item.modelCode"
                />
              </el-select>
            </el-col>
            <el-col :span="20" style="width: 30%">
              <el-button v-show="diagnosis.modelCode !== ''" class="el-button1" size="large" type="primary" @click="startPredict">
                点击开始预测
              </el-button>
            </el-col>
          </el-row>
          <el-row justify="center" />
          <el-divider />
          <el-divider />

          <div v-show="showDetails" id="pre_info" type="flex" justify="center" align="middle">
            <el-row justify="center">
              <el-col class="title" type="flex" justify="center" align="middle">
                <h2>诊断信息</h2>
              </el-col>
            </el-row>
            <el-row justify="center" type="flex" align="middle">
              <el-col style="width: 10%">
                <a>
                  输入患者姓名
                </a>
              </el-col>
              <el-col style="width: 30%">

                <el-input
                  v-model="diagnosis.patientName"
                  placeholder="患者姓名"
                  label="患者姓名"
                  clearable
                  :rules="[() => diagnosis.patientName != null || '患者姓名不能为空']"
                />
              </el-col>
            </el-row>
            <el-divider />
            <el-row justify="center" type="flex" align="middle">
              <el-col style="width: 30%">
                <a>
                  自动预测疗效为:
                </a>
                <el-select
                  v-model="diagnosis.sysDiagResult"
                  placeholder="自动判断疗效"
                  clearable
                  disabled
                  @change="getsysDiagResult"
                >
                  <el-option
                    v-for="item in results"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>

              <el-col style="width: 30%">
                <a>
                  请医师判断疗效：
                </a>
                <el-select
                  v-model="diagnosis.docDiagResult"
                  placeholder="请医师判断疗效"
                  clearable
                  @change="getdocDiagResult"
                >
                  <el-option
                    v-for="item in results"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>

            </el-row>
            <el-divider />
            <el-divider />
            <el-row justify="center" type="flex" align="middle">
              <el-col style="width: 10%">
                <a>
                  诊断详情
                </a>
              </el-col>
              <el-col :span="20">
                <el-input
                  v-model="diagnosis.diagDetails"
                  placeholder="请输入诊断详情"
                  label="诊断详情"
                  clearable
                  :rules="[() => diagnosis.diagDetails != null || '诊断详情不能为空']"
                />
              </el-col>
            </el-row>
            <el-divider />
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="20">
                <el-button size="large" type="primary" @click="publish">上传信息</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-dialog type="primary" :visible="showMessage" title="诊断信息" centered @close="showMessage=false">
        <p>{{ message }}</p>
        <div slot="footer" class="dialog-footer" style="bottom: 70px">
          <el-button :disabled="cancleClick" @click="showMessage=false">取 消</el-button>
          <el-button :disabled="okClick" type="primary" @click="showMessage=false">确 定</el-button>
        </div>
      </el-dialog>

    </el-row>
  </div>
</template>
<script>

import store from '@/store'

import { saveDiag, predict, uploadFileImage, uploadFileMask, queryAllModel } from '@/api/application/nsclc'

export default {

  name: 'Uploadvideo',
  data() {
    return {
      rules: [
        value => !value || value.size < 20000000 || 'Avatar size should be less than 20MB'
      ],
      showDetails: true,
      diagnosis: {
        diagnosisCode: '',
        sysDiagResult: '空',
        docDiagResult: '空',
        imageFileLoc: '',
        maskFileLoc: '',
        modelCode: '',
        diagDetails: '',
        patientName: '',
        featuresXlsxLoc: ''
      },
      models: [],
      temp: {},
      resultMap: {
        Set: function(key, value) {
          this[key] = value
        },
        Get: function(key) {
          return this[key]
        }
      },
      docDiagResult: -1,
      sysDiagResult: -1,
      showMessage: false,
      message: '',
      cancleClick: false,
      okClick: false,
      dataForm: {},
      fileDataImage: [],
      fileDataMask: [],
      results: [
        { value: -1, label: '空' },
        { value: 0, label: '无疗效' },
        { value: 1, label: '有疗效' }
      ],
      flag: {
        image: false,
        mask: false
      },
      showNrrdBtn: true
    }
  },
  created() {
    this.showDetails = store.getters.roles[0] !== 'PAT'
    this.init()
    this.initResult()
    this.loadAllModels()
  },
  methods: {
    init() {
      this.diagnosis = {
        diagnosisCode: '', sysDiagResult: '空', docDiagResult: '空', imageFileLoc: '', maskFileLoc: '', modelCode: '',
        diagDetails: '', patientName: '', featuresXlsxLoc: '', doctorName: ''
      }
      this.docDiagResult = -1
      this.sysDiagResult = -1
      this.temp = {}
      this.flag.image = false
      this.flag.mask = false
      this.fileDataImage = []
      this.fileDataMask = []
      this.cancleClick = false
      this.okClick = false
      this.showNrrdBtn = true
    },
    initResult() {
      this.resultMap.Set(-1, '空')
      this.resultMap.Set(0, '无疗效')
      this.resultMap.Set(1, '有疗效')
    },
    startPredict() {
      this.showMessage = true
      this.message = '正在评估中，请稍等……'
      this.cancleClick = true
      this.okClick = true
      const predictParam = new FormData()
      predictParam.append('imageFileLoc', this.diagnosis.imageFileLoc)
      predictParam.append('maskFileLoc', this.diagnosis.maskFileLoc)
      predictParam.append('diagnosisCode', this.temp.diagnosisCode)
      predictParam.append('modelCode', this.diagnosis.modelCode)
      predict(predictParam).then(response => {
        this.diagnosis.diagnosisCode = response.data.diagnosisCode
        this.diagnosis.sysDiagResult = response.data.sysDiagResult
        this.diagnosis.featuresXlsxLoc = response.data.featuresXlsxLoc
        this.message = '评估结果为：' + this.resultMap.Get(this.diagnosis.sysDiagResult)
        if (this.showDetails) {
          this.message += '，请继续输入其他信息并保存'
        }
        this.showMessage = true
        this.cancleClick = false
        this.okClick = false
      })
      console.log('开始预测')
    },
    loadAllModels() {
      queryAllModel().then(response => {
        this.models = response.data
        console.log(this.models)
      })
    },
    publish() {
      this.fileDataImage = []
      this.fileDataMask = []
      saveDiag(this.diagnosis).then(response => {
        console.log(response)
        this.message = '保存成功,诊断信息为： 患者：' + this.diagnosis.patientName + ' 自动评价: ' +
        this.resultMap.Get(this.diagnosis.sysDiagResult) +
        ' 医生评价：' + this.resultMap.Get(this.diagnosis.docDiagResult) + ' 详情信息：' + this.diagnosis.diagDetails
        this.showMessage = true
        this.init()
      }).catch(response => {
        this.message = '保存失败'
        this.showMessage = true
      })
    },
    onConfirm() {
      this.$emit('bulkImport', 11)
    },
    closeModal() {
      this.$emit('close')
    },
    getsysDiagResult(value) {
      console.log(value)
      console.log(this.diagnosis)
    },
    // TODO 算法逻辑
    getdocDiagResult(value) {

    },
    flagImage() {
      if (this.flag.image === true) {
        this.init()
      } else {
        if (this.flag.mask === false) {
          this.init()
        }
      }
      this.flag.image = true
      console.log(this.diagnosis)
    },
    flagMask() {
      if (this.flag.mask === true) {
        this.init()
      } else {
        if (this.flag.image === false) {
          this.init()
        }
      }
      this.flag.mask = true
      console.log(this.diagnosis)
    },
    UploadMask(param) {
      const uploadMaskParam = new FormData()
      uploadMaskParam.append('file', param.file)
      uploadMaskParam.append('diagnosisCode', this.temp.diagnosisCode)
      uploadFileMask(uploadMaskParam).then(response => {
        this.flagMask()
        this.diagnosis.maskFileLoc = response.data.maskFileLoc
        console.log('上传图片成功')
        param.onSuccess()
      }).catch(response => {
        console.log('图片上传失败')
        param.onError()
      })
    },
    UploadImage(param) {
      const uploadImageParam = new FormData()
      uploadImageParam.append('file', param.file)
      this.showMessage = true
      this.message = '正在上传中，由于文件较大，请稍候'
      this.cancleClick = true
      this.okClick = true
      uploadFileImage(uploadImageParam).then(response => {
        this.flagImage()
        console.log(response)
        this.temp.diagnosisCode = response.data.diagnosisCode
        this.diagnosis.diagnosisCode = response.data.diagnosisCode
        this.diagnosis.imageFileLoc = response.data.imageFileLoc
        this.showMessage = false
        this.message = ''
        this.cancleClick = false
        this.okClick = false
        this.showNrrdBtn = false
        param.onSuccess()
      }).catch(response => {
        console.log('图片上传失败')
        this.showMessage = false
        this.message = ''
        this.cancleClick = false
        this.okClick = false
        param.onError()
      })
    },
    // 移除回调
    handleRemove(file, fileList) {
      console.log('移除回调')
      console.log(this.diagnosis)
      if (this.flag.image === true) {
        this.flag.image = false
        this.diagnosis.imageFileLoc = ''
      } else if (this.flag.mask === true) {
        this.flag.mask = false
        this.diagnosis.maskFileLoc = ''
      }
    },
    shownrrd() {
      window.open('http://' + location.host.split(':')[0] + ':9528/#/shownrrd/' + this.diagnosis.diagnosisCode, '_blank')
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log('点击文件列表中已上传的文件时的钩子')
      console.log(file)
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      a.download = file.name
      a.href = file.url
      a.dispatchEvent(event)
    },
    // 成功回调
    handleAvatarSuccess(res, file, fileList) {
      console.log('成功回调')
      console.log(this.diagnosis)
    },
    // 删除
    deleteHandle(id) {
      console(id)
    },
    handleImageChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileDataImage = [fileList[fileList.length - 1]]
      }
    },
    handleMaskChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileDataMask = [fileList[fileList.length - 1]]
      }
    }
  }
}
</script>

<style>
#upload {
  min-height: 100%;
  width: 100%;
  height:100%;
}
.el-button1 {
  display: block;
  margin: 0 auto;
}

  /* 解决内部滚动条 */
  .el-main {
    overflow:hidden;
  }
/* el-divider 修改高度&虚线效果 */
.el-divider--horizontal{
     margin: 8px 0;
     background: 0 0;
     border-top: 1px dashed #e8eaec;
 }
</style>
