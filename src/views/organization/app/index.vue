<template>
  <div class="app-container">
    <div class="filter-container">

      <!--查询条件-->
      <el-input @keyup.enter.native="handleFilter"
                style="width: 200px;"
                class="filter-item"
                placeholder="应用名"
                v-model="listQuery.appName">
      </el-input>

      <!--动作按钮-->
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-download" :loading="downloadLoading"
                 @click="handleDownload">
        导出
      </el-button>
    </div>

    <!--列表-->
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="70" align="center" label="列号"/>
      <el-table-column width="180px" align="center" label="应用ID号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="应用名">
        <template slot-scope="scope">
          <span>{{scope.row.appName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="应用icon">
        <template slot-scope="scope">
          <span>{{scope.row.appIcon}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="应用描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{scope.row.updatedBy}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createdBy}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.current"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right"
               label-width="120px" status-icon
               style='width: 80%; margin-left:60px;'>
        <el-form-item label="应用名" prop="appName">
          <el-input v-model="temp.appName" placeholder="请输入应用名"></el-input>
        </el-form-item>
        <el-form-item label="应用icon" prop="appIcon">
          <el-input v-model="temp.appIcon" placeholder="请输入应用icon"></el-input>
        </el-form-item>
        <el-form-item label="应用描述" prop="description">
          <el-input :rows="5"
                    type="textarea"
                    v-model="temp.description"
                    placeholder="请输入应用描述">
          </el-input>
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
  import { queryApp, getApp, createApp, updateApp, deleteApp } from '@/api/organization/app'

  import waves from '@/directive/waves'

  export default {
    name: 'appManagement',
    // 水波文效果
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        downloadLoading: false,
        // 查询参数
        listQuery: {
          status: 'ok',
          current: 1,
          size: 10
        },
        dialogStatus: 'create',
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
    filters: {
      
    },
    // 页面加载完成后显示列表页
    created() {
      this.queryApp()
      this.resetForm()
    },
    methods: {
      /**
       * 应用列表
       */
      queryApp() {
        this.listLoading = true
        queryApp(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      // 查询过滤器
      handleFilter() {
        this.listQuery.current = 1
        this.queryApp()
      },
      /**
       * 修改每页显示条数
       */
      handleSizeChange(val) {
        this.listQuery.size = val
        this.queryApp()
      },
      /**
       * 跳转到指定页
       */
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.queryApp()
      },
      /**
       * 重置添加表单
       */
      resetForm() {
        this.temp = {
          appName: '',
          appIcon: '',
          description: ''
        }
      },
      /**
       * 弹出创建应用表单
       */
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.resetForm()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      /**
       * 创建应用
       */
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createApp(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '创建成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.temp.roleIds = []
              this.queryApp()
            })
          }
        })
      },
      /**
       * 弹出修改应用表单
       */
      handleUpdate(id) {
        this.listLoading = true
        getApp(id).then(response => {
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
            updateApp(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.temp.roleIds = []
              this.queryApp()
            })
          }
        })
      },
      /**
       * 删除应用
       */
      deleteData(id) {
        this.$confirm('此操作将删除该应用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }).then(() => {
          deleteApp(id).then(() => {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.queryApp()
          })
        })
      },
      /**
       * 导出列表
       */
      handleDownload() {
        console.log('download')
      }
    }
  }
</script>

