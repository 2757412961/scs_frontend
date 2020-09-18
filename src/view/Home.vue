<template>
  <Layout style="height:100%;">
    <Header>
      <HeadNav></HeadNav>
    </Header>
    <Layout>

        <map-layout ref="mapLayout"></map-layout>

        <Typhoon></Typhoon>



    </Layout>
  </Layout>
</template>


<script>
    import MapLayout from "./MapLayout";
    import HeadNav from "./HeadNav";
    import Typhoon from "../components/Typhoon/Typhoon";
    export default {
      name: "home",
      components: {Typhoon, HeadNav, MapLayout},
      computed: {

      },
      created:function(){
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
      methods:{

      }
    }
</script>

<style scoped>


</style>
