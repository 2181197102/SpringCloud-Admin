<template>
  <div class="search">
    <div class="filter-container">

      <!--查询条件-->
      <el-input
        v-model="listQuery.modelCode"
        style="width: 200px;"
        class="filter-item"
        placeholder="model编码"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.modelName"
        style="width: 200px;"
        class="filter-item"
        placeholder="模型名称"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.fileName"
        style="width: 200px;"
        class="filter-item"
        placeholder="模型文件名"
        @keyup.enter.native="handleFilter"
      />
      <!--动作按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>

    </div>

    <!--列表-->
    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="40" align="center" label="列号" />
      <el-table-column width="180px" align="center" label="model编码">
        <template slot-scope="scope">
          <span>{{ scope.row.modelCode }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="模型名称">
        <template slot-scope="scope">
          <span>{{ scope.row.modelName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="模型文件名称">
        <template slot-scope="scope">
          <span>{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="模型详情">
        <template slot-scope="scope">
          <span>{{ scope.row.modelDetails }}</span>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.modelCode)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row.modelCode)">
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
        :page-sizes="[5,10, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        status-icon
        style="width: 80%; margin-left:60px;"
      >
        <el-form-item v-show="dialogStatus === 'create'" label="模型编码" prop="modelCode">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="string"
            :http-request="UploadModel"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-change="handleModelChange"
            :file-list="fileData"
          >
            <el-button slot="trigger" size="small" type="primary">上传Model</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="模型编码" prop="modelCode">
          <el-input v-model="temp.modelCode" placeholder="modelCode" readonly />
        </el-form-item>
        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="temp.modelName" placeholder="请输入模型姓名" />
        </el-form-item>
        <el-form-item label="诊断模型文件名" prop="fileName">
          <el-input v-model="temp.fileName" placeholder="请输入模型文件名" readonly />
        </el-form-item>
        <el-form-item label="模型详情" prop="modelDetails">
          <el-input
            v-model="temp.modelDetails"
            :rows="5"
            type="textarea"
            placeholder="请输入模型详情"
          />
        </el-form-item>
      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-if="dialogStatus=='edit'" type="primary" @click="updateData">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveModelInfo, queryModel, getModel, updateModel, deleteModel } from '@/api/application/nsclc'

import waves from '@/directive/waves'
import { uploadModel } from '../../../api/application/nsclc'

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
        modelCode: '',
        modelName: '',
        fileName: '',
        current: 1,
        size: 5
      },
      dialogStatus: 'edit',
      dialogFormVisible: false,
      // 表单校验规则
      rules: {
        appName: [
          { required: true, message: '应用名必填', trigger: 'blur' }
        ]
      },
      // 创建或修改应用临时对象
      temp: {},
      model: {
        modelCode: '',
        fileName: '',
        modelName: '',
        modelLoc: '',
        modelDetails: ''
      },
      fileData: []
    }
  },
  // 页面加载完成后显示列表页
  created() {
    this.queryModel()
    this.resetForm()
  },
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveModelInfo(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryModel()
          })
        }
      })
    },
    /**
       * 应用列表
       */
    queryModel() {
      this.listLoading = true
      queryModel(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      }).catch(response => {
        this.$router.push('/nsclc/401')
      })
    },
    // 查询过滤器
    handleFilter() {
      this.listQuery.current = 1
      this.queryModel()
    },
    /**
       * 修改每页显示条数
       */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryModel()
    },
    /**
       * 跳转到指定页
       */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryModel()
    },
    /**
       * 重置添加表单
       */
    resetForm() {
      this.temp = {
        modelCode: '',
        modelName: '',
        fileName: '',
        modelLoc: ''
      }
      this.fileData = []
    },
    /**
       * 弹出修改应用表单
       */
    handleUpdate(modelCode) {
      this.listLoading = true
      getModel(modelCode).then(response => {
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
          updateModel(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryModel()
          })
        }
      })
    },

    deleteData(modelCode) {
      this.$confirm('此操作将删除该model, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        type: 'warning'
      }).then(() => {
        deleteModel(modelCode).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryModel()
        })
      })
    },
    UploadModel(param) {
      const uploadModelParam = new FormData()
      uploadModelParam.append('file', param.file)
      uploadModel(uploadModelParam).then(response => {
        console.log(response)
        this.temp.modelCode = response.data.modelCode
        this.temp.modelLoc = response.data.modelLoc
        this.temp.fileName = response.data.fileName

        this.model.modelCode = response.data.modelCode
        this.model.modelLoc = response.data.modelLoc
        this.model.fileName = response.data.fileName
        console.log(this.model)
        param.onSuccess()
        // 上传成功的图片会显示绿色的对勾
        // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
      }).catch(response => {
        console.log('图片上传失败')
        param.onError()
      })
    },
    // 移除回调
    handleRemove(file, fileList) {
      console.log('移除回调')
      console.log(this.model)
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
      console.log(this.model)
    },
    handleModelChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileData = [fileList[fileList.length - 1]]
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetForm()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
