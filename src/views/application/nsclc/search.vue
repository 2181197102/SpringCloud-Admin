<template>
  <div class="search">
    <div class="filter-container">

      <!--查询条件-->
      <el-input
        v-model="listQuery.diagnosisCode"
        style="width: 200px;"
        class="filter-item"
        placeholder="诊断编码"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.patientName"
        style="width: 200px;"
        class="filter-item"
        placeholder="患者姓名"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.doctorName"
        style="width: 200px;"
        class="filter-item"
        placeholder="诊断医生姓名"
        @keyup.enter.native="handleFilter"
      />
      <span padding="10px">&nbsp;自动评估结果：</span>
      <el-select
        v-model="listQuery.sysDiagResult"
        clearable
        style="width: 120px"
        class="filter-item"
        placeholder="自动评估结果"
      >
        <el-option
          v-for="item in results"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span>&nbsp;医生评估结果：</span>
      <el-select
        v-model="listQuery.docDiagResult"
        clearable
        style="width: 120px"
        class="filter-item"
        placeholder="医生评估结果"
      >
        <el-option
          v-for="item in results"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <!--动作按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!--列表-->
    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="40" align="center" label="列号" />
      <el-table-column width="180px" align="center" label="诊断编码">
        <template slot-scope="scope">
          <span>{{ scope.row.diagnosisCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="患者姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.patientName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="诊断医生">
        <template slot-scope="scope">
          <span>{{ scope.row.doctorName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="自动评估结果">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.sysDiagResult"
            placeholder="自动判断疗效"
            clearable
            disabled
          >
            <el-option
              v-for="item in results"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- <span>{{ scope.row.description }}</span> -->
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="医生评估结果">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.docDiagResult"
            placeholder="医生判断疗效"
            clearable
            disabled
          >
            <el-option
              v-for="item in results"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="诊断详情">
        <template slot-scope="scope">
          <span>{{ scope.row.diagDetails }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="70px" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="70px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150px">
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

    <!--翻页工具条-->
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

    <!--编辑对话框-->
    <el-dialog title="修改" :visible.sync="dialogFormVisible">
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
          <el-input v-model="temp.diagnosisCode" placeholder="diagnosisCode" readonly />
        </el-form-item>
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="temp.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="诊断医生姓名" prop="doctorName">
          <el-input v-model="temp.doctorName" placeholder="请输入诊断医生姓名" />
        </el-form-item>
        <el-form-item width="120px" label="自动评估结果" prop="sysDiagResult">
          <template>
            <el-select
              v-model="temp.sysDiagResult"
              placeholder="自动判断疗效"
              clearable
              disabled
            >
              <el-option
                v-for="item in results"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item width="120px" label="医生评估结果" prop="docDiagResult">
          <template>
            <el-select
              v-model="temp.docDiagResult"
              placeholder="医生判断疗效"
              clearable
            >
              <el-option
                v-for="item in results"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="诊断详情" prop="diagDetails">
          <el-input
            v-model="temp.diagDetails"
            :rows="5"
            type="textarea"
            placeholder="请输入诊断详情"
          />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button> -->
        <el-button v-if="dialogStatus=='edit'" type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryNsclc, getNsclc, updateNsclc, deleteNsclc } from '@/api/application/nsclc'

import waves from '@/directive/waves'

export default {
  name: 'AppManagement',
  // 水波文效果
  directives: {
    waves
  },
  filters: {

  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      // 查询参数
      listQuery: {
        diagnosisCode: '',
        patientName: '',
        doctorName: '',
        sysDiagResult: -1,
        docDiagResult: -1,
        current: 1,
        size: 10
      },
      results: [
        { value: -1, label: '空' },
        { value: 0, label: '无疗效' },
        { value: 1, label: '有疗效' }
      ],
      dialogStatus: 'edit',
      dialogFormVisible: false,
      // 表单校验规则
      rules: {
        appName: [
          { required: true, message: '应用名必填', trigger: 'blur' }
        ]
      },
      // 创建或修改应用临时对象
      temp: {}
    }
  },
  // 页面加载完成后显示列表页
  created() {
    this.queryDiag()
    this.resetForm()
  },
  methods: {
    /**
       * 应用列表
       */
    queryDiag() {
      this.listLoading = true
      queryNsclc(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      }).catch(response => {
        console.log('kjveli!!!')
        console.log(response)
        this.$router.push('/nsclc/401')
      })
    },
    // 查询过滤器
    handleFilter() {
      this.listQuery.current = 1
      this.queryDiag()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryDiag()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryDiag()
    },
    /**
       * 重置添加表单
       */
    resetForm() {
      this.temp = {
        diagnosisCode: '',
        patientName: '',
        doctorName: '',
        sysDiagResult: -1,
        docDiagResult: -1
      }
    },
    /**
       * 弹出修改应用表单
       */
    handleUpdate(diagnosisCode) {
      this.listLoading = true
      getNsclc(diagnosisCode).then(response => {
        this.temp = response.data
        this.listLoading = false
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
      })
      this.$forceUpdate(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 修改应用信息
       */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateNsclc(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.temp.roleIds = []
            this.queryDiag()
          })
        }
      })
    },
    /**
       * 删除应用
       */
    deleteData(diagnosisCode) {
      this.$confirm('此操作将删除该应用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        type: 'warning'
      }).then(() => {
        deleteNsclc(diagnosisCode).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryDiag()
        })
      })
    }
  }
}
</script>

<style>
.search {
  min-height: 100%;
  width: 100%;
  height: 100%;
}

</style>
