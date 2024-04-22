<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
    <div :key="key" style="margin-top:30px;">
      <div>
        <span v-permission="['ADMIN']" class="permission-alert">
          Only
          <el-tag class="permission-tag" size="small">ADMIN</el-tag> can see this
        </span>
        <el-tag v-permission="['ADMIN']" class="permission-sourceCode" type="info">
          v-permission="['ADMIN']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['DOC']" class="permission-alert">
          Only
          <el-tag class="permission-tag" size="small">DOC</el-tag> can see this
        </span>
        <el-tag v-permission="['DOC']" class="permission-sourceCode" type="info">
          v-permission="['DOC']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['ADMIN','DOC']" class="permission-alert">
          Both
          <el-tag class="permission-tag" size="small">ADMIN</el-tag> and
          <el-tag class="permission-tag" size="small">DOC</el-tag> can see this
        </span>
        <el-tag v-permission="['ADMIN','DOC']" class="permission-sourceCode" type="info">
          v-permission="['ADMIN','DOC']"
        </el-tag>
      </div>
    </div>

    <div :key="'checkPermission'+key" style="margin-top:60px;">
      <aside>
        In some cases, using v-permission will have no effect. For example: Element-UI's Tab component or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.
        <br> e.g.
      </aside>

      <el-tabs type="border-card" style="width:550px;">
        <el-tab-pane v-if="checkPermission(['ADMIN'])" label="ADMIN">
          Admin can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkPermission(['ADMIN'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['DOC'])" label="DOC">
          DOC can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkPermission(['DOC'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['ADMIN','DOC'])" label="Admin-OR-DOC">
          Both ADMIN or DOC can see this
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkPermission(['ADMIN','DOC'])"
          </el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'DirectivePermission',
  components: { SwitchRoles },
  directives: { permission },
  data() {
    return {
      key: 1 // 为了能每次切换权限的时候重新初始化指令
    }
  },
  methods: {
    checkPermission,
    handleRolesChange() {
      this.key++
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }
  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>

