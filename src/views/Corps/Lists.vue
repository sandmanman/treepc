<template>
  <div id="corps">
    <HeaderView>
      <div slot="left">
        <Breadcrumb>
          <BreadcrumbItem>
            组织管理
          </BreadcrumbItem>
          <BreadcrumbItem>
            组织列表
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div slot="right" class="">
        <Button type="primary" ghost @click="showEditGroup">新建组织</Button>
      </div>
    </HeaderView>
    <Content class="content">
      <Table border :columns="column" :data="usercorps"></Table>
    </Content>
    <Modal v-model="editShow" title="组织编辑" @on-ok="saveCorp">
      <Form ref="usercorp" :model="usercorp" :rules="rules" :label-width="80">
        <FormItem label="组织名称" prop="corpname">
          <Input v-model="usercorp.corpname" type="text" placeholder="组织名称" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import HeaderView from '../../components/Layout/HeaderView.vue'
  export default {
    name: 'corps',
    components: {
      HeaderView
    },
    data() {
      return {
        roleMap: {
          10: '普通用户',
          20: '管理员',
          30: '超级管理员'
        },
        editShow: false,
        rules: {
          corpname: [{
            required: true,
            min: 2,
            max: 20,
            message: '请输入2-20位组织名称',
            trigger: 'blur'
          }]
        },
        column: [{
          title: '组织',
          key: 'corpname',
          width: 200
        }, {
          title: '所有者',
          key: 'adminName',
          width: 120,
          render: (h, params) => {
            return h('div', params.row.corp.adminName);
          }
        }, {
          title: '我的角色',
          key: 'corpRoleName',
          width: 100,
          render: (h, params) => {
            return h('div', this.roleMap[params.row.role || 10]);
          }
        }, {
          title: '操作',
          key: 'action',
          align: 'left',
          render: (h, params) => {
            let buttons = [];
            if (params.row.role === 30) {
              buttons = [
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
                      this.editCorpInfo(params);
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
                      this.deleteCorp(params)
                    }
                  }
                }, '删 除')
              ];
            } else {
              buttons = [
                h('Button', {
                  props: {
                    ghost: true,
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.getOutCorp(params);
                    }
                  }
                }, '退出组织'),
              ]
            }
            if (this.signCorp.corpId !== params.row.corpId) {
              buttons.push(h('Button', {
                props: {
                  ghost: true,
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.selectCorp(params);
                  }
                }
              }, '选择组织'))
            }
            return h('div', buttons);
          }
        }],
        usercorps: [],
        signCorp: {},
        usercorp: {corpname: ''},
      }
    },
    methods: {
      getUsercorps() {
        this.$http.get(`/api/corps/usercorps`).then((res) => {
          let resData = res.data;
          if (resData.errcode === 0) {
            this.usercorps = resData.data || [];
            if(!this.$store.state.usercorp) {
              this.$store.commit('setUsercorp', (resData.data ||[])[0])
              this.signCorp = JSON.parse(localStorage.getItem('usercorp')) || {}
            }
          }
        });
      },
      editCorpInfo(params) {
        this.usercorp = params.row || {}
        this.editShow = true;
      },
      showEditGroup() {
        this.usercorp = {
          corpname: '',
        }
        this.editShow = true;
      },
      createCorp() {
        this.$http.post(`/api/corps`, this.usercorp).then(() => {
          this.getUsercorps();
        });
      },
      updateCorp() {
        let that = this;
        this.$http.put(`/api/corps/${this.usercorp.corpId}`, {
          corpname: this.usercorp.corpname
        }).then((res) => {
          let resData = res.data;
          if (resData.errcode === 0) {
            this.getUsercorps();
            if (that.usercorp.corpId === that.signCorp.corpId) {
              that.$store.commit('setUsercorp', that.usercorp);
              this.signCorp = JSON.parse(localStorage.getItem('usercorp')) || {}
            }
          } else {
            this.$Message({
              type: 'error',
              message: resData.data.message
            })
          }
        });
      },
      saveCorp() {
        let that = this;
        this.$refs.usercorp.validate(valid => {
          if (!valid) return;
          if (!that.usercorp.corpId) {
            that.createCorp();
          } else {
            that.updateCorp();
          }
          this.editShow = false;
        })
      },
      deleteCorp(params) {
        let that = this;
        if (params.row.role !== 30) {
          this.$Message({
            type: 'error',
            message: '没有权限',
          })
          return;
        }
        this.$Modal.confirm({
          title: '删除警告',
          content: '<p>删除后任何人无法进入该组织，数据无法恢复</p>',
          onOk: () => {
            this.$http.delete(`/api/corps/${params.row.corpId}`)
              .then((res) => {
                let resData = res.data;
                if (resData.errcode === 0) {
                  this.getUsercorps();
                  if (params.row.corpId === that.signCorp.corpId) {
                    that.$store.commit('setUsercorp', null);
                  }
                } else {
                  this.$Message({
                    type: 'error',
                    message: resData.data.message
                  })
                }
              });
          }
        });
      },
      getOutCorp(params) {
        let that = this;
        this.$Modal.confirm({
          title: '退出警告',
          content: '<p>退出该组织后将无法看到该组织的任何信息</p>',
          onOk: () => {
            this.$http.post(`/api/corps/${params.row.corpId}/leave`)
              .then((res) => {
                let resData = res.data;
                if (resData.errcode === 0) {
                  this.getUsercorps();
                  if (params.row.corpId === that.signCorp.corpId) {
                    that.$store.commit('setUsercorp', null);
                  }
                } else {
                  this.$Message({
                    type: 'error',
                    message: resData.data.message
                  })
                }
              });
          }
        });
      },
      selectCorp(params) {
        this.$store.commit('setUsercorp', params.row);
        this.signCorp = params.row;
      }
    },
    created() {
      this.signCorp = JSON.parse(localStorage.getItem('usercorp')) || {}
      this.getUsercorps()
    }
  }
</script>