<template>
  <div id="profile">
    <HeaderView>
      <div slot="left">
        <Breadcrumb>
          <BreadcrumbItem to="/">
            控制面板
          </BreadcrumbItem>
          <BreadcrumbItem :to="{name: 'profile'}">
            我的信息
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </HeaderView>
    <Content class="content">
      <h3>我的信息</h3>
      <div class="profile-item">
        <div class="item-title">账号</div> <span class="item-info">{{userinfo.phone}}</span>
      </div>
      <div class="profile-item">
        <div class="item-title">昵称</div> <span class="item-info">{{userinfo.username}}</span>
      </div>
      <div class="profile-item">
        <div class="item-title">角色</div> <span class="item-info">{{roleMap[userinfo.role]}}</span>
      </div>
      <div class="profile-item" v-if="userinfo.email">
        <div class="item-title">邮箱</div> <span class="item-info">{{userinfo.email}}</span>
      </div>
    </Content>
  </div>
</template>
<script>
  import HeaderView from '../../components/Layout/HeaderView.vue'
  export default {
    name: 'profile',
    components: {
      HeaderView
    },
    data() {
      return {
        userinfo: this.$store.state.user,
        roleMap: {
          10: '普通用户',
          20: '管理员',
          30: '超级管理员'
        }
      }
    }
  }
</script>

<style scoped>
.profile-item {
  margin: 10px 0px;
  font-size: 16px;
}

.item-title {
  width: 80px;
  float: left;
  text-align:right;
}

.item-info {
  margin-left: 20px;
}
</style>
