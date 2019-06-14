<template>
  <div class="headerwrap">
    <Header class="layout-header-bar header" theme="light">
      <Row>
        <Col :xs="{span: 12}" :sm="{span: 14}" :md="{span: 14}" :lg="{span: 16}" :xl="{span: 18}">
          <Row>
            <Col :span="12" class="header-left">
            <slot name="left"></slot>
            </Col>
            <Col :span="12" class="text-right">
            <slot name="right"></slot>
            </Col>
          </Row>
        </Col>
        <Col :xs="{span: 12}" :sm="{span: 10}" :md="{span: 10}" :lg="{span: 8}" :xl="{span: 6}">
          <div class="header-right">
            <span v-if="$store.state.usercorp" class="corp-title">{{$store.state.usercorp.corpname}}</span>
            <Button v-if="$store.getters.isSuperAdmin" ghost type="success">系统管理</Button>
            <Dropdown @on-click="select" class="userzone" v-if="$store.state.user">
              <a href="javascript:void(0)">
                {{$store.state.user.username}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="profile">我的信息</DropdownItem>
                <DropdownItem name="usermanage">用户管理</DropdownItem>
                <DropdownItem name="issues">问题反馈</DropdownItem>
                <DropdownItem name="signout">退出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </Header>
  </div>
</template>
<script>
  export default {
    name: 'HeaderView',
    methods: {
      select(name) {
        if (name === 'profile') {
          this.$router.push({
            name: 'profile'
          })
          return;
        }
        if (name === 'signout') {
          return this.signout()
        }
      },
      signout() {
        this.$http.post('/api/auth/signout');
        this.$store.commit('setUsercorp', null)
        this.$store.commit('setUser', null)
        this.$store.commit('setSignin', false)
        localStorage.clear('user')
        localStorage.clear('expire')
        this.$router.push({
          name: 'sign'
        });
      }
    }
  }
</script>

<style scoped>
  .header {
    height: 100%;
  }

  .headerwrap {
    border-bottom: 1px solid #ddd;
  }

  .header-left {
    float: left;
  }

  .header-right {
    text-align: right;
  }

  .text-right {
    text-align: right;
  }

  .ivu-layout-header {
    background: #fff !important;
    padding: 0px 10px;
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

  .userzone {
    margin-left: 20px;
  }

  .corp-title {
    margin-right: 20px;
    font-size: 16px;
  }
</style>