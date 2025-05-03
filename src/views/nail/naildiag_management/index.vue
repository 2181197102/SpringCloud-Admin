<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- Search Filters -->
      <el-input
        v-model="listQuery.diagnosisCode"
        style="width: 200px;"
        class="filter-item"
        placeholder="诊断编码"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.doctorName"
        clearable
        style="width: 200px;"
        class="filter-item"
        placeholder="病历类别"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input
        v-model="listQuery.patientName"
        style="width: 200px;"
        class="filter-item"
        placeholder="患者姓名"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.resultAccuracy"
        clearable
        style="width: 200px"
        class="filter-item"
        placeholder="识别总体审核结果"
      >
        <el-option
          v-for="item in accuracyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="listQuery.openId"
        style="width: 200px;"
        class="filter-item"
        placeholder="微信OpenID"
        @keyup.enter.native="handleFilter"
      />

      <!-- Action Buttons -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <!-- Diagnoses List Table -->
    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="center" label="序号" />
      <el-table-column min-width="150" align="center" label="诊断编码">
        <template slot-scope="scope">
          <span>{{ scope.row.diagnosisCode }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140" align="center" label="病历类别">
        <template slot-scope="scope">
          <span>{{ scope.row.doctorName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150" align="center" label="患者姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150" align="center" label="微信OpenID">
        <template slot-scope="scope">
          <span>{{ scope.row.openId }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="80" align="center" label="已被审核次数">
        <template slot-scope="scope">
          <span>{{ scope.row.cnt }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="90" align="center" label="识别总体审核结果">
        <template slot-scope="scope">
          <el-tag :type="getAccuracyTagType(scope.row.resultAccuracy)">
            {{ getAccuracyLabel(scope.row.resultAccuracy) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="150" align="center" label="反馈结果">
        <template slot-scope="scope">
          <span>{{ scope.row.feedBack }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150" align="center" label="诊断结果">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.diagResult" placement="top">
            <span>{{ scope.row.diagResult ? (scope.row.diagResult.length > 15 ? scope.row.diagResult.substring(0, 15) + '...' : scope.row.diagResult) : '' }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column min-width="160" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="160" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.diagnosisCode)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row.diagnosisCode)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination Component -->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Edit Dialog -->
    <el-dialog title="修改诊断信息" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:60px;"
      >
        <el-form-item label="诊断编码" prop="diagnosisCode">
          <el-input v-model="temp.diagnosisCode" disabled />
        </el-form-item>
        <el-form-item label="病历类别" prop="doctorName">
          <el-select v-model="temp.doctorName" placeholder="请选择病历类别">
            <el-option
              v-for="item in categoryOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="temp.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="微信OpenID" prop="openId">
          <el-input v-model="temp.openId" disabled />
        </el-form-item>
        <el-form-item label="已被审核次数" prop="cnt">
          <el-input v-model="temp.cnt" placeholder="请输入已被审核次数" />
        </el-form-item>
        <el-form-item label="识别总体审核结果" prop="resultAccuracy">
          <el-select v-model="temp.resultAccuracy" placeholder="请选择">
            <el-option
              v-for="item in accuracyFullOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片URL" prop="imageFile">
          <el-input v-model="temp.imageFile" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="诊断结果" prop="diagResult">
          <el-input
            v-model="temp.diagResult"
            :rows="3"
            type="textarea"
            placeholder="请输入诊断结果"
          />
        </el-form-item>
        <el-form-item label="结果反馈" prop="feedBack">
          <el-input
            v-model="temp.feedBack"
            :rows="3"
            type="textarea"
            placeholder="请输入结果反馈"
          />
        </el-form-item>
      </el-form>
      <!-- Dialog Action Buttons -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchDiagnoses, updateDiagnosis, deleteDiagnosis } from '@/api/application/nail'
import waves from '@/directive/waves'

export default {
  name: 'NailDiagnosisManagement',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      // Query parameters
      listQuery: {
        diagnosisCode: '',
        doctorName: '',
        patientName: '',
        resultAccuracy: '',
        openId: '',
        current: 1,
        size: 10
      },
      // Category options for selection
      categoryOptions: ['普通用户_自测', '认证用户_自测', '管理员_测试'],
      // Accuracy options for filter - simplified version
      accuracyOptions: [
        { value: 1, label: '准确' },
        { value: 0, label: '待定' },
        { value: -1, label: '不准确' }
      ],
      // Full accuracy options for form editing
      accuracyFullOptions: [
        { value: 2, label: '非常准确' },
        { value: 1, label: '准确' },
        { value: 0, label: '待定' },
        { value: -1, label: '不准确' },
        { value: -2, label: '非常不准确' }
      ],
      dialogFormVisible: false,
      // Form validation rules
      rules: {
        doctorName: [
          { required: true, message: '病历类别必选', trigger: 'change' }
        ],
        patientName: [
          { required: true, message: '患者姓名必填', trigger: 'blur' },
          { max: 50, message: '患者姓名长度不能超过50个字符', trigger: 'blur' }
        ],
        cnt: [
          { pattern: /^[0-9]+$/, message: '已被审核次数必须为数字', trigger: 'blur' }
        ]
      },
      // Temporary object for form data
      temp: {
        diagnosisCode: '',
        doctorName: '',
        patientName: '',
        imageFile: '',
        diagResult: '',
        resultAccuracy: null,
        feedBack: '',
        openId: '',
        cnt: 0
      }
    }
  },
  // Load diagnoses when component is created
  created() {
    this.fetchDiagnoses()
  },
  methods: {
    /**
     * Get accuracy tag type based on resultAccuracy value
     */
    getAccuracyTagType(accuracy) {
      if (accuracy > 0) return 'success'
      if (accuracy < 0) return 'danger'
      return 'info' // For pending (value = 0)
    },
    /**
     * Get accuracy label based on resultAccuracy value
     */
    getAccuracyLabel(accuracy) {
      if (accuracy > 0) return '准确'
      if (accuracy < 0) return '不准确'
      return '待定'
    },
    /**
     * Fetch diagnoses list
     */
    fetchDiagnoses() {
      this.listLoading = true
      searchDiagnoses(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /**
     * Handle filter button click
     */
    handleFilter() {
      this.listQuery.current = 1
      this.fetchDiagnoses()
    },
    /**
     * Change number of items per page
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.fetchDiagnoses()
    },
    /**
     * Jump to specific page
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.fetchDiagnoses()
    },
    /**
     * Reset form data
     */
    resetTemp() {
      this.temp = {
        diagnosisCode: '',
        doctorName: '',
        patientName: '',
        imageFile: '',
        diagResult: '',
        resultAccuracy: null,
        feedBack: '',
        openId: '',
        cnt: 0
      }
    },
    /**
     * Open update dialog
     */
    handleUpdate(diagnosisCode) {
      this.resetTemp()

      // Find the diagnosis in the list
      const item = this.list.find(item => item.diagnosisCode === diagnosisCode)
      if (item) {
        // Copy data to temp object
        Object.assign(this.temp, item)
        this.dialogFormVisible = true

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    /**
     * Submit updated data
     */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const diagnosisCode = this.temp.diagnosisCode
          const tempData = Object.assign({}, this.temp)

          updateDiagnosis(diagnosisCode, tempData).then(() => {
            // Close dialog and show success message
            this.dialogFormVisible = false
            this.$notify({
              title: '修改成功',
              message: '诊断信息已成功更新',
              type: 'success',
              duration: 2000
            })

            // Refresh data
            this.fetchDiagnoses()
          })
        }
      })
    },
    /**
     * Delete diagnosis
     */
    deleteData(diagnosisCode) {
      this.$confirm('此操作将删除该诊断记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        type: 'warning'
      }).then(() => {
        deleteDiagnosis(diagnosisCode).then(() => {
          this.$notify({
            title: '删除成功',
            message: '诊断记录已成功删除',
            type: 'success',
            duration: 2000
          })

          // Refresh data
          this.fetchDiagnoses()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * Export data as CSV
     */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['诊断编码', '病历类别', '患者姓名', '诊断结果', '已被审核次数', '识别总体审核结果', '反馈结果', '微信OpenID', '创建时间']
        const filterVal = ['diagnosisCode', 'doctorName', 'patientName', 'diagResult', 'cnt', 'resultAccuracy', 'feedBack', 'openId', 'createdTime']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '诊断记录' + new Date().getTime()
        })
        this.downloadLoading = false
      })
    },
    /**
     * Format JSON data for export
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createdTime' || j === 'updatedTime') {
          return this.$options.filters.parseTime(v[j], '{y}-{m}-{d} {h}:{i}:{s}')
        } else if (j === 'resultAccuracy') {
          return this.getAccuracyLabel(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
.pagination-container {
  margin-top: 30px;
}
</style>
