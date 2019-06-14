<template>
  <div id="sign">
    <div class="sign-title">家谱管理系统</div>
    <div class="sign-panel">
      <div class="left">
        <div style="text-align:center; margin: 20px;">
          <h2>系 统 登 录</h2>
        </div>
        <Form ref="signinRef" :model="signinForm" :rules="rules" :label-width="60">
          <FormItem label="手机" prop="phone">
            <Input v-model="signinForm.phone" type="number" placeholder="请输入手机号" />
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="signinForm.password" type="password" placeholder="请输入密码" />
          </FormItem>
          <FormItem>
            <Button type="success" ghost @click="signin">登 录</Button>
          </FormItem>
        </Form>
      </div>
      <div class="right">
        <div style="text-align:center; margin: 20px;">
          <h2>用 户 注 册</h2>
        </div>
        <Form ref="signupRef" :model="signupForm" :rules="rules" :label-width="60">
          <FormItem label="手机" prop="phone">
            <Input v-model="signupForm.phone" type="number" placeholder="请输入手机号" />
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="signupForm.password" type="password" placeholder="请输入密码" />
          </FormItem>
          <FormItem label="姓名" prop="username">
            <Input v-model="signupForm.username" type="text" placeholder="姓名" />
          </FormItem>
          <FormItem label="组织" prop="corpname">
            <Input v-model="signupForm.corpname" type="text" placeholder="请输入组织名称" />
          </FormItem>
          <FormItem>
            <Button type="success" ghost @click="signup">用户注册</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <Modal v-model="corpPickView" title="组织选择">
      <Table border :columns="corpColumns" :data="usercorps"></Table>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'signin',
    data() {
      return {
        signinForm: {
          phone: '',
          password: ''
        },
        rules: {
          phone: [{
            required: true,
            pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
            message: '请输入正确的手机号',
            trigger: 'blur',
          }],
          password: [{
            required: true,
            min: 6,
            max: 16,
            message: '请输入6-16位密码',
            trigger: 'blur',
          }],
          username: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          }, {
            min: 2,
            max: 12,
            trigger: 'blur',
            message: '请输入2-0位字符'
          }],
          corpname: [{
            required: true,
            trigger: 'blur',
            message: '请输入组织名称'
          }, {
            min: 2,
            max: 12,
            trigger: 'blur',
            message: '请输入2-12位字符'
          }]
        },
        signupForm: {
          phone: '',
          password: '',
          username: '',
          corpname: ''
        },
        signType: 'signin',
        corpPickView: false,
        corpColumns: [{
          title: '组织',
          key: 'corpname'
        }, {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
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
                    this.selectCorp(params.row);
                  }
                }
              }, '进入组织')
            ]);
          }
        }],
        usercorps: []
      }
    },
    methods: {
      signin() {
        this.signType = 'signin';
        this.sign()
      },
      signup() {
        this.signType = 'signup';
        this.sign()
      },
      sign() {
        let that = this;
        let typeName = this.signType === 'signin' ? '登录': '注册'

        this.$refs[`${this.signType}Ref`].validate(valid => {
          if (!valid) {
            return;
          }

          this.$http.post(`/api/auth/${that.signType}`, this[`${this.signType}Form`]).then(res => {
            var resData = res.data;
            if (resData.errcode === 0) {
              this.$Message.success(`${typeName}成功`)
              let user = resData.data;
              localStorage.setItem('expire', Date.now() + (24 * 60 * 60 - 10 * 60) * 1000)
              localStorage.setItem('user', user)
              that.$store.commit('setSignin', true);
              that.$store.commit('setUser', user);
              that.selectCorpView();
              return;
            }
            this.$Message.error(resData.errmsg);
          }).catch(() => {
            this.$Message.error(`${typeName}失败`);
          })
        })
      },
      selectCorpView() {
        this.$http.get(`/api/corps/usercorps`).then(res => {
          var resData = res.data;
          if (resData.errcode === 0) {
           this.usercorps = resData.data || []
            if(this.usercorps.length === 0) {
              this.$store.commit('setUsercorp', null);
              this.$router.push({name: 'corps'})
              return;
            }
            if(this.usercorps.length === 1) {
              this.selectCorp(this.usercorps[0])
              return;
            }
            this.corpPickView = true;
            return;
          }
          this.$Message.error(`系统出错`);
        });        
      },
      selectCorp(usercorp) {
        this.$store.commit('setUsercorp', usercorp);
        this.corpPickView = false;
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped>
  .sign-panel {
    width: 60%;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #ddd;
    height: 360px;
  }

  .sign-title {
    text-align: center;
    margin-top: 100px;
    font-size: 20px;
  }

  .left {
    float: left;
    width: 50%;
    border-right: 1px solid #ddd;
    height: inherit;
    padding-right: 20px;
  }

  .right {
    float: left;
    width: 50%;
    height: inherit;
    padding-right: 20px;
  }
</style>