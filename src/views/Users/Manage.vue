<template>
  <div id="manage">
    <HeaderView>
      <div slot="left">
        <Breadcrumb>
          <BreadcrumbItem>
            用户管理
          </BreadcrumbItem>
          <BreadcrumbItem>
            用户列表
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div slot="right" class="">
        <Button type="primary" ghost @click="showEditUser" v-if="$store.getters.isAdmin">新建用户</Button>
      </div>
    </HeaderView>
    <Content class="content">
      <Table border :columns="column" :data="corpusers"></Table>
    </Content>
    <Modal v-model="editShow" title="人员编辑" @on-ok="saveUser">
      <Form ref="user" :model="user" :rules="rules" :label-width="80">
        <FormItem label="组织">
          <Input v-model="user.corpname" disabled/>
        </FormItem>
        <FormItem label="手机" prop="phone">
          <Input v-model="user.phone" type="number" placeholder="请输入手机号" :disabled="!!user.id"/>
        </FormItem>
        <FormItem label="姓名" prop="username">
          <Input v-model="user.username" type="text" placeholder="用户姓名" :disabled="!!user.id"/>
        </FormItem>
        <FormItem label="角色" >
          <Select v-model="user.role">
            <Option :value="10">普通用户</Option>
            <Option :value="20">管理员</Option>
          </Select>
        </FormItem>
      </Form>
      <Alert>用户可使用手机号登录,默认密码为手机号。</Alert>
    </Modal>
  </div>
</template>

<script>
import HeaderView from '../../components/Layout/HeaderView.vue'
export default {
  name: 'usermanage',
  components: { HeaderView },
  data() {
    return {
      roleMap: {
        10: '普通用户',
        20: '管理员',
        30: '超级管理员'
      },
      editShow: false,
      rules: {
        phone: [{
          required: true,
          pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }],
        username: [{
          required: true,
          message: '请输入用户姓名',
          trigger: 'blur'
        }]
      },
      column: [{
        title: '姓名',
        key: 'username',
      }, {
        title: '手机',
        key: 'phone',
        render: (h, params) => {
          return h('div', params.row.user.phone);
        }
      }, {
        title: '组织角色',
        key: 'corpRoleName',
        render: (h, params) => {
          return h('div', this.roleMap[params.row.role || 10]);
        }
      }, {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          if(params.row.role === 30 || this.$store.state.usercorp.role <= params.row.role) {
            return ''
          }
           return h('div', [
             h('Button', {
              props: {
                ghost: true,
                type: 'primary',
                size: 'small'
              },
              style: {
                  marginRight: '5px'
              },
              on: {
                click: () => {
                  this.editUserInfo(params);
                }
              }
            }, '编 辑'),
            h('Button', {
              props: {
                ghost: true,
                type: 'error',
                size: 'small'
              },
              style: {
                  marginRight: '5px'
              },
              on: {
                click: () => {
                  this.deleteUserFromTree(params)
                }
              }
            }, '删 除')
           ]);
        }
      }],
      corpusers: [],
      usercorp: {},
      user: {},
    }
  },
  methods: {
    getCorpUsers() {
      this.$http.get(`/api/corps/${this.usercorp.corpId}/users`).then((res) =>{
        let resData = res.data;
        if(resData.errcode === 0) {
          this.corpusers = resData.data || [];
        }
      });
    },
    editUserInfo(params) {
      let corpuser = params.row ||{};
      this.user = {
        corpId: corpuser.corpId,
        corpname: corpuser.corpname,
        role: corpuser.role,
        id: corpuser.id,
        userId: corpuser.userId,
        username: corpuser.username,
        phone: corpuser.user ? corpuser.user.phone : ''
      }
      this.editShow = true;
    },
    showEditUser() {
      this.user = {
        corpId: this.usercorp.corpId,
        corpname: this.usercorp.corpname,
        phone: null,
        username: '',
        role: 10,
      }
      this.editShow = true;
    },
    createUser() {
      this.$http.post(`/api/corps/${this.usercorp.corpId}/users`, this.user).then(() => {
        this.getCorpUsers();
      });
    },
    updateUser() {
      this.$http.put(`/api/corps/${this.usercorp.corpId}/users/${this.user.userId}`,this.user).then(() => {
        this.getCorpUsers()
      });
    },
    saveUser() {
      let that = this;
      this.$refs.user.validate(valid => {
        if(!valid) return;
        if(!that.user.id) {
          that.createUser();
        } else {
          that.updateUser();
        }
        this.editShow = false;
      })
    },
    addUserToTree() {
      this.user.treeId = this.tree.id;
      this.$http.post('/api/users/add', this.user).then(() => {
        this.getCorpUsers();
      });
    },
    deleteUserFromTree(params) {
      console.log(params.row)
      this.$http.delete(`/api/users/${params.row.id}/remove`, {data: params.row}).then(() => {
        this.getCorpUsers()
      });
    }
  },
  created() {
    this.usercorp = JSON.parse(localStorage.getItem('usercorp'))
    this.getCorpUsers()
  }
}
</script>

