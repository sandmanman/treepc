<template>
  <div id="paperlists">
    <HeaderView>
      <div slot="left">
        <Breadcrumb>
          <BreadcrumbItem>
            文章管理
          </BreadcrumbItem>
          <BreadcrumbItem>
            文章列表
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div slot="right" class="">
        <Button type="primary" ghost :to="{name: 'paperedit'}">新建文章</Button>
      </div>
    </HeaderView>
    <Content class="content">
      <Table border :columns="column" :data="paperlists"></Table>
    </Content>
  </div>
</template>
<script>
import HeaderView from '../../components/Layout/HeaderView.vue'

export default {
  name: 'paperlists',
  components: { HeaderView },
  data() {
    return {
      column: [{
        title: '标题',
        key: 'title',
      }, {
        title: '主题',
        key: 'keywords'
      }, {
        title: '日期',
        key: 'date'
      }, {
        key: '状态',
        key: 'status'
      }],
      paperlists: []
    }
  }
}
</script>

