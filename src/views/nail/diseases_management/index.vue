<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新增甲病</el-button>
    </div>

    <!-- 数据列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="中文名称" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.chName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="中文缩写" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.chAbbr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="英文名称" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.enName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="英文缩写" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.enAbbr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标签" align="center" min-width="40">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>

      <el-table-column label="数量" align="center" min-width="40">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '新增甲病' : '编辑甲病'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 10px"
      >
        <el-form-item label="中文名称" prop="chName">
          <el-input v-model="temp.chName" placeholder="请输入中文名称" />
        </el-form-item>
        <el-form-item label="中文缩写" prop="chAbbr">
          <el-input v-model="temp.chAbbr" placeholder="请输入中文缩写" />
        </el-form-item>
        <el-form-item label="英文名称" prop="enName">
          <el-input v-model="temp.enName" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="英文缩写" prop="enAbbr">
          <el-input v-model="temp.enAbbr" placeholder="请输入英文缩写" />
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input v-model="temp.label" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="temp.count" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定要删除该甲病数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllNailDiseases, addNailDisease, updateNailDisease, deleteNailDiseaseById } from '@/api/application/nail'

export default {
  name: 'NailDiseaseManagement',
  data() {
    return {
      list: [],
      listLoading: true,
      temp: {
        id: undefined,
        chName: '',
        chAbbr: '',
        enName: '',
        enAbbr: '',
        label: '',
        count: '',
        description: '',
        deleted: 'N'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      deleteDialogVisible: false,
      deleteId: null,
      rules: {
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
    this.getList()
  },
  methods: {
    // 获取数据列表
    getList() {
      this.listLoading = true
      getAllNailDiseases()
        .then(response => {
          console.log('API响应:', response) // 添加调试日志
          if (response.code === '000000') {
            this.list = response.data
          } else {
            this.$message.error(response.mesg || '获取数据失败')
          }
          this.listLoading = false
        })
        .catch(error => {
          console.error('获取甲病列表失败:', error)
          this.$message.error('获取数据失败，请检查网络连接和API配置')
          this.listLoading = false
        })
    },

    // 显示新增对话框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 重置表单数据
    resetTemp() {
      this.temp = {
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

    // 创建数据
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log('创建数据:', tempData) // 添加调试日志

          addNailDisease(tempData)
            .then(response => {
              console.log('创建响应:', response) // 添加调试日志
              if (response.code === '000000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error(response.mesg || '创建失败')
              }
            })
            .catch(error => {
              console.error('创建甲病失败:', error)
              this.$message.error('创建失败，请检查网络连接和API配置')
            })
        }
      })
    },

    // 显示编辑对话框
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象，避免直接修改列表数据
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 更新数据
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log('更新数据:', tempData) // 添加调试日志

          updateNailDisease(tempData)
            .then(response => {
              console.log('更新响应:', response) // 添加调试日志
              if (response.code === '000000') {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error(response.mesg || '更新失败')
              }
            })
            .catch(error => {
              console.error('更新甲病失败:', error)
              this.$message.error('更新失败，请检查网络连接和API配置')
            })
        }
      })
    },

    // 显示删除确认对话框
    handleDelete(row) {
      this.deleteId = row.id
      this.deleteDialogVisible = true
    },

    // 确认删除
    confirmDelete() {
      console.log('删除ID:', this.deleteId) // 添加调试日志

      deleteNailDiseaseById(this.deleteId)
        .then(response => {
          console.log('删除响应:', response) // 添加调试日志
          if (response.code === '000000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.deleteDialogVisible = false
            this.getList()
          } else {
            this.$message.error(response.mesg || '删除失败')
          }
        })
        .catch(error => {
          console.error('删除甲病失败:', error)
          this.$message.error('删除失败，请检查网络连接和API配置')
        })
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-container .el-button {
  margin-bottom: 10px;
}
</style>
