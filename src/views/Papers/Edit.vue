<template>
  <div id="paperedit">
    <HeaderView>
      <div slot="left">
        <Breadcrumb>
          <BreadcrumbItem>
            文章管理
          </BreadcrumbItem>
          <BreadcrumbItem>
            文章编辑
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div slot="right" class="">
        <Button type="primary" ghost :to="{name: 'paperlists'}">文章列表</Button>
      </div>
    </HeaderView>
    <Content class="content">
       <Form ref="paper" :model="paper" :rules="rules" :label-width="80">
         <FormItem label="标题">
          <Input v-model="paper.title" placeholder="输入标题"></Input>
        </FormItem>
        <FormItem label="説明">
          <Input type="textarea" v-model="paper.title" placeholder="输入标题"></Input>
        </FormItem>
       </Form>
      <Row>
        <Col :span="24">
        <quill-editor :content="paper.content"
        :options="editorOption">
      </quill-editor>
        </Col>
        <Col :span="12" class="btn-area">
          <Button type="warning" ghost>取消</Button>
          <Button type="success" ghost>保存文章</Button>
        </Col>
      </Row>
    </Content>
  </div>
</template>
<script>
import HeaderView from '../../components/Layout/HeaderView.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'paperedit',
  components: { HeaderView, quillEditor },
  data() {
    return {
      paper: {
        title: '',
        content: ''
      },
      editorOption: {
        // modules: {}
      },
      rules: {

      },
      
    }
  }
}
</script>

<style>
.ql-editor {
  min-height: 340px !important;
}
.btn-area {
  margin-top: 20px;
}
.btn-area button {
  margin-right: 10px;
}
.content {
  padding-bottom: 20px;
}
</style>


