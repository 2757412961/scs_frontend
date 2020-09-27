<template>
  <Layout style="height:100%;">
    <Header>
      <HeadNav @clearMap="clearMap"></HeadNav>
    </Header>
    <Layout>
      <map-layout ref="mapLayout"></map-layout>
      <router-view/>
    </Layout>
  </Layout>
</template>


<script>
    import MapLayout from "./MapLayout";
    import HeadNav from "./HeadNav";
    import Typhoon from "../components/Typhoon/Typhoon";

    import {globalBus} from "../components/globalBus";

    export default {
      name: "home",
      components: {Typhoon, HeadNav, MapLayout},
      computed: {

      },
        methods: {
          clearMap(val){
              this.$refs.mapLayout.clearLayerSource();
          }
        },
      created:function(){
        // 在页面加载时读取sessionStorage里的状态信息
        if (sessionStorage.getItem('store')) {
          this.$store.replaceState(
            Object.assign(
              {},
              this.$store.state,
              JSON.parse(sessionStorage.getItem('store'))
            )
          )
        }
        // 在页面刷新时将vuex里的信息保存到sessionStorage里
        // beforeunload事件在页面刷新时先触发
        window.addEventListener('beforeunload', () => {
          sessionStorage.setItem('store', JSON.stringify(this.$store.state))
        })

        if(this.$store.state.name==""){
          this.$router.push({
            name: 'login'
          })
        }
      },
      watch: {
        // 可以通过watch监听vuex中的text，数据变动时能够执行对应的函数
        '$store.state.name':function(newer, older) { // 可以获取新值与老值两个参数
          if(newer==""){
            this.$router.push({
              name: 'login'
            })
          }
        },
        deep: true // 开启深度监听
      },
    }
</script>

<style scoped>


</style>
