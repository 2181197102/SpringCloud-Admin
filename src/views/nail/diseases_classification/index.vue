<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>待归类病种列表</span>
        <el-button
          v-if="refreshLoading"
          :loading="refreshLoading"
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-refresh"
          @click="fetchDiseaseList"
        >刷新</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="listLoading"
        :data="diseaseList"
        element-loading-text="加载中..."
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="序号"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          label="诊断编码"
          align="center"
          min-width="200"
          prop="diagnosisCode"
          show-overflow-tooltip
        />

        <el-table-column
          label="OpenID"
          align="center"
          min-width="200"
          prop="openId"
          show-overflow-tooltip
        />

        <el-table-column
          label="类型"
          align="center"
          width="150"
          prop="doctorName"
        />

        <el-table-column
          label="患者姓名"
          align="center"
          width="120"
          prop="patientName"
        />

        <el-table-column
          label="识别结果"
          align="center"
          width="120"
          prop="diagResult"
        />

        <el-table-column
          label="审核次数"
          align="center"
          width="100"
          prop="cnt"
        />

        <el-table-column
          label="操作"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewDetail(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      title="病种详情"
      :visible.sync="detailDialogVisible"
      width="80%"
      :before-close="handleDialogClose"
    >
      <div v-loading="detailLoading">
        <!-- 图片展示区域 -->
        <el-card class="image-card">
          <div slot="header">
            <span>病例图片</span>
          </div>
          <div v-if="images.length === 0" class="no-image">暂无图片</div>
          <div v-else class="image-container">
            <div
              v-for="(image, index) in images"
              :key="index"
              class="image-wrapper"
              :class="{ 'single-image': images.length === 1 }"
            >
              <el-image
                :src="image"
                fit="cover"
                :preview-src-list="images"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </div>
          </div>
        </el-card>

        <!-- 诊断信息展示 -->
        <el-card class="info-card">
          <div slot="header">
            <span>诊断信息</span>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="诊断编码">{{ currentRecord.diagnosisCode }}</el-descriptions-item>
            <el-descriptions-item label="OpenID">{{ currentRecord.openId }}</el-descriptions-item>
            <el-descriptions-item label="患者姓名">{{ currentRecord.patientName }}</el-descriptions-item>
            <el-descriptions-item label="当前识别结果">{{ currentRecord.diagResult }}</el-descriptions-item>
            <el-descriptions-item label="审核次数">{{ currentRecord.cnt }}</el-descriptions-item>
            <el-descriptions-item label="识别时间">{{ formatDate(currentRecord.createdTime) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 审核记录展示 -->
        <el-card class="record-card">
          <div slot="header">
            <span>审核记录</span>
          </div>
          <el-table
            :data="doctorRecords"
            border
            style="width: 100%"
          >
            <el-table-column
              align="center"
              label="审核人OpenID"
              prop="openId"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column
              label="审核意见"
              prop="feedbackOnshow"
              min-width="250"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              label="审核时间"
              width="180"
            >
              <template slot-scope="scope">
                {{ formatDate(scope.row.updatedTime) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 病种归类区域 -->
        <el-card class="classification-card">
          <div slot="header">
            <span>病种归类</span>
          </div>
          <el-form :model="classificationForm" label-width="100px">
            <el-form-item label="诊断结果">
              <el-select
                v-model="classificationForm.diagResult"
                filterable
                placeholder="请选择诊断结果"
                style="width: 100%"
              >
                <el-option
                  v-for="disease in allDiseases"
                  :key="disease.id"
                  :label="disease.chName"
                  :value="disease.chName"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="classifyLoading"
                @click="handleClassify"
              >提交归类</el-button>
              <el-alert
                type="warning"
                :closable="false"
                style="margin-top: 10px; margin-bottom: 10px"
              >
                <div class="add-disease-alert">
                  <span>系统未收录病种？</span>
                  <el-button type="text" class="add-disease-btn" @click="handleCreateDisease">请新增病种</el-button>
                </div>
              </el-alert>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-dialog>

    <!-- 新增病种对话框 -->
    <el-dialog title="新增甲病" :visible.sync="addDiseaseDialogVisible">
      <el-form
        ref="diseaseForm"
        :rules="diseaseRules"
        :model="diseaseTemp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 10px"
      >
        <el-form-item label="中文名称" prop="chName">
          <el-input v-model="diseaseTemp.chName" placeholder="请输入中文名称" />
        </el-form-item>
        <el-form-item label="中文缩写" prop="chAbbr">
          <el-input v-model="diseaseTemp.chAbbr" placeholder="请输入中文缩写" />
        </el-form-item>
        <el-form-item label="英文名称" prop="enName">
          <el-input v-model="diseaseTemp.enName" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="英文缩写" prop="enAbbr">
          <el-input v-model="diseaseTemp.enAbbr" placeholder="请输入英文缩写" />
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input v-model="diseaseTemp.label" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="diseaseTemp.count" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="diseaseTemp.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDiseaseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createDisease">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDiseasesForClassification,
  getDoctorRecordsByDiagnosisCode,
  getImage,
  getAllNailDiseases,
  classifyDisease,
  addNailDisease
} from '@/api/application/nail'

export default {
  name: 'DiseaseClassification',
  data() {
    return {
      // 列表相关
      diseaseList: [], // 待归类的疾病列表
      listLoading: false, // 列表加载状态
      refreshLoading: false, // 刷新按钮加载状态

      // 详情相关
      detailDialogVisible: false, // 详情对话框显示状态
      detailLoading: false, // 详情加载状态
      currentRecord: {}, // 当前查看的记录
      images: [], // 图片列表
      doctorRecords: [], // 医生审核记录

      // 归类相关
      allDiseases: [], // 所有甲病信息
      classificationForm: {
        diagResult: ''
      },
      classifyLoading: false, // 归类提交加载状态

      // 新增病种相关
      addDiseaseDialogVisible: false, // 新增病种对话框显示状态
      diseaseTemp: {
        id: undefined,
        chName: '',
        chAbbr: '',
        enName: '',
        enAbbr: '',
        label: '',
        count: '0',
        description: '',
        deleted: 'N'
      },
      diseaseRules: {
        chName: [{ required: true, message: '中文名称是必填项', trigger: 'blur' }],
        chAbbr: [{ required: true, message: '中文缩写是必填项', trigger: 'blur' }],
        enName: [{ required: true, message: '英文名称是必填项', trigger: 'blur' }],
        enAbbr: [{ required: true, message: '英文缩写是必填项', trigger: 'blur' }],
        label: [{ required: true, message: '标签是必填项', trigger: 'blur' }],
        count: [{ required: true, message: '数量是必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchDiseaseList()
  },
  methods: {
    // 获取待归类的疾病列表
    fetchDiseaseList() {
      this.listLoading = true
      this.refreshLoading = true
      getDiseasesForClassification()
        .then(response => {
          if (response.code === '000000' && response.data) {
            this.diseaseList = response.data
          } else {
            this.$message.error(response.mesg || '获取待归类疾病列表失败')
          }
        })
        .catch(error => {
          console.error('获取待归类疾病列表出错:', error)
          this.$message.error('获取待归类疾病列表失败')
        })
        .finally(() => {
          this.listLoading = false
          this.refreshLoading = false
        })
    },

    // 查看详情
    handleViewDetail(row) {
      this.currentRecord = row
      this.detailDialogVisible = true
      this.classificationForm.diagResult = row.diagResult || ''
      this.detailLoading = true

      // 获取所有病种信息
      this.fetchAllDiseases()

      // 获取图片
      this.fetchImages(row.imageFile)

      // 获取审核记录
      this.fetchDoctorRecords(row.diagnosisCode)
    },

    // 获取所有甲病信息
    fetchAllDiseases() {
      return new Promise((resolve, reject) => {
        getAllNailDiseases()
          .then(response => {
            if (response.code === '000000' && response.data) {
              this.allDiseases = response.data
              resolve(response.data)
            } else {
              console.error('获取甲病信息失败:', response.mesg)
              // 这里不再显示错误消息，只记录日志
              reject(new Error(response.mesg || '获取甲病信息失败'))
            }
          })
          .catch(error => {
            console.error('获取甲病信息出错:', error)
            // 这里不再显示错误消息，只记录日志
            reject(error)
          })
      })
    },

    // 获取图片
    fetchImages(imageFiles) {
      this.images = []
      if (!imageFiles) {
        return
      }

      // 分割图片路径
      const imagePaths = imageFiles.split(',').filter(path => path.trim())
      const imagePromises = []

      // 最多获取5张图片
      const maxImages = Math.min(imagePaths.length, 5)

      for (let i = 0; i < maxImages; i++) {
        if (imagePaths[i] && imagePaths[i].trim()) {
          const promise = getImage(imagePaths[i].trim())
            .then(response => {
              // 将Blob转为URL
              return URL.createObjectURL(response)
            })
            .catch(error => {
              console.error(`获取图片(${imagePaths[i]})出错:`, error)
              return null
            })
          imagePromises.push(promise)
        }
      }

      Promise.all(imagePromises)
        .then(results => {
          this.images = results.filter(url => url !== null)
        })
        .catch(error => {
          console.error('处理图片出错:', error)
          this.$message.error('获取图片失败')
        })
    },

    // 获取医生审核记录
    fetchDoctorRecords(diagnosisCode) {
      getDoctorRecordsByDiagnosisCode(diagnosisCode)
        .then(response => {
          if (response.code === '000000' && response.data) {
            this.doctorRecords = response.data
          } else {
            this.$message.error(response.mesg || '获取审核记录失败')
          }
        })
        .catch(error => {
          console.error('获取审核记录出错:', error)
          this.$message.error('获取审核记录失败')
        })
        .finally(() => {
          this.detailLoading = false
        })
    },

    // 提交病种归类
    handleClassify() {
      if (!this.classificationForm.diagResult) {
        this.$message.warning('请选择诊断结果')
        return
      }

      this.classifyLoading = true
      classifyDisease(this.currentRecord.diagnosisCode, this.classificationForm.diagResult)
        .then(response => {
          if (response.code === '000000') {
            this.$message.success('病种归类成功')
            this.handleDialogClose()
            this.fetchDiseaseList() // 刷新列表
          } else {
            this.$message.error(response.mesg || '病种归类失败')
          }
        })
        .catch(error => {
          console.error('病种归类出错:', error)
          this.$message.error('病种归类失败')
        })
        .finally(() => {
          this.classifyLoading = false
        })
    },

    // 打开新增病种对话框
    handleCreateDisease() {
      this.resetDiseaseTemp()
      this.addDiseaseDialogVisible = true
      this.$nextTick(() => {
        this.$refs['diseaseForm'] && this.$refs['diseaseForm'].clearValidate()
      })
    },

    // 重置新增病种表单
    resetDiseaseTemp() {
      this.diseaseTemp = {
        id: undefined,
        chName: '',
        chAbbr: '',
        enName: '',
        enAbbr: '',
        label: '',
        count: '0',
        description: '',
        deleted: 'N'
      }
    },

    // 创建新病种
    createDisease() {
      this.$refs['diseaseForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.diseaseTemp)
          console.log('创建新病种:', tempData)

          addNailDisease(tempData)
            .then(response => {
              if (response.code === '000000') {
                this.$notify({
                  title: '成功',
                  message: '新增病种成功',
                  type: 'success',
                  duration: 2000
                })
                this.addDiseaseDialogVisible = false

                // 保存新增的病种名称
                const newDiseaseName = this.diseaseTemp.chName

                // 重新获取所有病种信息
                getAllNailDiseases()
                  .then(response => {
                    if (response.code === '000000' && response.data) {
                      this.allDiseases = response.data
                      // 自动选中新增的病种
                      this.classificationForm.diagResult = newDiseaseName
                    }
                  })
                  .catch(err => {
                    console.error('获取更新后的病种列表失败:', err)
                    // 即使获取最新列表失败，也尝试将新增的病种设为选中
                    this.classificationForm.diagResult = newDiseaseName
                  })
              } else {
                this.$message.error(response.mesg || '新增病种失败')
              }
            })
            .catch(error => {
              console.error('新增病种失败:', error)
              this.$message.error('新增病种失败，请检查网络连接和API配置')
            })
        }
      })
    },

    // 关闭对话框
    handleDialogClose() {
      // 释放图片URL资源
      this.images.forEach(url => {
        URL.revokeObjectURL(url)
      })

      this.detailDialogVisible = false
      this.images = []
      this.doctorRecords = []
      this.currentRecord = {}
      this.classificationForm.diagResult = ''
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.image-card,
.info-card,
.record-card,
.classification-card {
  margin-bottom: 20px;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-wrapper {
  width: calc(33.33% - 7px);
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 图片数量为1时的样式 */
.single-image {
  width: 100%;
  max-width: 500px;
  height: 350px;
}

/* 图片数量为2时的样式 */
.image-container:has(.image-wrapper:nth-child(2):last-child) .image-wrapper {
  width: calc(50% - 5px);
  height: 300px;
}

/* 图片数量为3时的样式 */
.image-container:has(.image-wrapper:nth-child(3):last-child) .image-wrapper {
  width: calc(33.33% - 7px);
  height: 250px;
}

/* 图片数量为4时的样式 */
.image-container:has(.image-wrapper:nth-child(4):last-child) .image-wrapper {
  width: calc(50% - 5px);
  height: 200px;
}

.image-wrapper .el-image {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.no-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: #f5f7fa;
  color: #909399;
  font-size: 16px;
}

/* 新增病种提示样式 */
.add-disease-alert {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.add-disease-btn {
  margin-left: 5px;
  font-weight: bold;
  color: #f56c6c;
  text-decoration: underline;
}
</style>
