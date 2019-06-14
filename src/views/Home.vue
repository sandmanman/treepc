<template>
  <div id="home">
    <HeaderView>
      <div slot="left">
        <Breadcrumb>
          <BreadcrumbItem :to="{name: 'home'}">
            控制面板
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </HeaderView>
    <Content class="content">
      <div class="tree-info" v-if="trees.length">
        <Alert type="warning" v-if="!$store.state.tree">
          家谱管理
          <template slot="desc">
            请设置操作家谱，作为当前需要操作的家谱项目
          </template>
        </Alert>
        <Alert type="success" v-else>
          家谱管理
          <template slot="desc">
            当前可编辑的家谱项目为 “{{$store.state.tree.title}}”
          </template>
        </Alert>
      </div>
      <div v-else>
        <Alert type="info">
          家谱管理
          <template slot="desc">
            请先创建家谱项目，再进行家谱操作！
          </template>
        </Alert>
      </div>
      <Row :gutter="10">
        ad
        <Col :span="6" class="tree-zone" v-for="tree in trees" :key="tree.id">
          <Card class="tree-card">
            <p slot="title">{{tree.title}}</p>
            <a href="#" slot="extra" @click.prevent="editTree(tree)" v-if="$store.getters.isAdmin">
              编辑
            </a>
            <div>
              <p>姓氏: {{tree.familyname}}</p>
              <p>简介: {{tree.description || tree.title}}</p>
            </div>
            <div class="btn-z">
              <Button type="error" ghost @click="deleteTree(tree)" v-if="$store.getters.isSuperAdmin">删除</Button>
              <Button type="success" ghost @click="setHandleTree(tree)">操作家谱</Button>
            </div>
          </Card>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col :span="6" class="tree-zone">
        <Card class="tree-card-add">
          <div @click="showEditView">
            <p class="tree-icon">
              <Icon type="md-add" />
            </p>
            <p>创建家谱项目</p>
          </div>
        </Card>
        </Col>
      </Row>
    </Content>
    <Modal v-model="editView" title="家谱编辑" @on-ok="saveTree">
      <Form ref="treeForm" :model="treeForm" :rules="rules" :label-width="80">
        <FormItem label="标题" prop="title">
          <Input v-model="treeForm.title" type="text" placeholder="家谱标题,比如“信阳刘氏族谱”" />
        </FormItem>
        <FormItem label="姓氏" prop="familyname">
          <Input v-model="treeForm.familyname" type="text" placeholder="家族姓氏" />
        </FormItem>
        <FormItem label="简介">
          <Input v-model="treeForm.description" type="textarea" placeholder="家谱简介" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import HeaderView from '../components/Layout/HeaderView.vue'
  export default {
    name: 'home',
    components: {
      HeaderView
    },
    data() {
      return {
        baseUri: `/api/corps/${this.$store.state.usercorp.corpId}/trees`,
        editView: false,
        treeForm: {
          title: '',
          description: '',
          familyname: '',
        },
        rules: {
          title: [{
            required: true,
            message: '请输入家谱标题',
            trigger: 'blur'
          }, {
            type: 'string',
            min: 4,
            max: 20,
            message: '请输入4-20位字符',
            trigger: 'blur'
          }],
          description: [{
            min: 0,
            max: 100,
            message: '请输入0-100位字符'
          }],
          familyname: [{
            required: true,
            message: '请输入姓氏',
            trigger: 'blur'
          }, {
            type: 'string',
            min: 1,
            max: 10,
            message: '姓氏位数在1-10位之间',
            trigger: 'blur'
          }]
        },
        trees: [],
      }
    },
    methods: {
      getTrees() {
        this.$http.get(`${this.baseUri}`).then(res => {
          let resData = res.data;
          if (resData.errcode === 0) {
            this.trees = resData.data || [];
            if (!this.$store.state.tree && this.trees.length) {
              this.$store.commit('setTree', this.trees[0])
            }
            if (!this.trees.length) {
              this.$store.commit('setTree', null)
            }
          }
        })
      },
      editTree(tree) {
        this.treeForm = tree;
        this.editView = true;
      },
      showEditView() {
        this.treeForm = {
          title: '',
          description: '',
          familyname: '',
        }
        this.editView = true;
      },
      saveTree() {
        this.$refs.treeForm.validate(valid => {
          if (!valid) return;
          let url = this.baseUri;
          this.$http({
            url: this.treeForm.id ? `${url}/${this.treeForm.id}` : url,
            method: this.treeForm.id ? 'PUT' : 'POST',
            data: this.treeForm
          }).then(() => {
            this.getTrees()
            this.editView = false;
          });
        })
      },
      deleteTree(tree) {
        this.$Modal.confirm({
          title: '删除家谱',
          content: `<p>确定要删除 “${tree.title}”项目</p>`,
          onOk: () => {
            this.$http.delete(`${this.baseUri}/${tree.id}`).then(() => {
              this.getTrees();
            })
          }
        })
      },
      setHandleTree(tree) {
        this.$store.commit('setTree', tree)
      }
    },
    created() {
      this.getTrees()
    }
  }
</script>

<style>
  .tree-card {
    min-height: 120px;
    cursor: pointer;
    border: 1px solid #19be6b !important;
    font-size: 20px;
    vertical-align: middle;
  }

  .tree-card-add {
    min-height: 120px;
    text-align: center;
    cursor: pointer;
    border: 1px dotted #ff9900 !important;
    font-size: 20px;
    vertical-align: middle;
  }

  .tree-zone {
    margin-top: 10px;
  }

  .btn-z {
    margin-top: 10px;
    text-align: right;
  }

  .btn-z button {
    margin-left: 4px;
  }

  .tree-info {}
</style>