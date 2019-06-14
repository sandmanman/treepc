<template>
  <div class="layout" id="app">
    <Layout style="flex-direction: row">
      <Sider ref="side" hide-trigger collapsible :collapsed-width="78" width="180" v-model="isCollapsed" class="sider"
        theme="light" v-if="$store.state.usercorp">
        <Menu active-name="home" theme="light" width="auto" :class="menuitemClasses" :open-names="['treemanage']">
          <MenuItem name="home" :to="{name: 'home'}">
          <Icon type="ios-home"></Icon>
          <span>控制面板</span>
          </MenuItem>
          <Submenu name="treemanage" v-if="$store.getters.isAdmin && $store.state.tree">
            <template slot="title">
              <Icon type="ios-paper" />
              族谱录入
            </template>
            <MenuItem name="treeedit">族谱录入</MenuItem>
            <MenuItem name="treeapproval">族谱审核</MenuItem>
            <MenuItem name="treelists">族谱列表</MenuItem>
          </Submenu>
          <Submenu name="papermanage" v-if="$store.state.tree">
            <template slot="title">
              <Icon type="ios-paper" />
              文章管理
            </template>
            <MenuItem name="paperlists" :to="{name: 'paperlists'}"> 文章列表</MenuItem>
            <MenuItem name="paperedit" :to="{name: 'paperedit'}">新建文章</MenuItem>
          </Submenu>
          <Submenu name="treeview" v-if="$store.state.tree">
            <template slot="title">
              <Icon type="ios-paper" />
              族谱预览
            </template>
            <MenuItem name="modernstyle">现代风格</MenuItem>
            <MenuItem name="ancientstyle">仿古风格</MenuItem>
          </Submenu>
          <MenuItem name="corps" :to="{name: 'corps'}">
          <Icon type="ios-body" />组织列表</MenuItem>
          <MenuItem name="corps" :to="{name: 'usermanage'}">
          <Icon type="ios-people" />用户管理</MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <router-view></router-view>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isCollapsed: false
      }
    },
    computed: {
      menuitemClasses() {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      collapsedSider() {
        this.$refs.side.toggleCollapse();
      }
    }
  }
</script>
<style>
  .layout {
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .sider {
    background: #fff;
    position: 'fixed';
    height: '100vh';
    left: 0;
    overflow: 'auto';
    border-right: 1px solid #ddd;
  }

  .content {
    padding: 10px;
    background: #fff !important;
  }

  .ivu-layout {
    height: 100vh;
    background: #fff !important;
  }

  .ivu-layout-sider {
    background: #fff !important;
  }

  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .ivu-menu-vertical.ivu-menu-light:after {
    width: 0 !important;
  }

  .menu-icon {
    transition: all .3s;
  }

  .rotate-icon {
    transform: rotate(-90deg);
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>