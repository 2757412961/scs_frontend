<template>
  <div>
    <Button type="primary" @click="modal1 = true">Display dialog box</Button>
    <Modal
      v-model="modal1"
      title="Common Modal dialog box title"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>

<script>
    export default {
        name: "PHProductImgs",
        data: function () {
            return {
                modal1: false


            }
        },
        methods: {
            ok() {
                this.$Message.info('Clicked ok');
            },
            cancel() {
                this.$Message.info('Clicked cancel');
            }


        },
        created() {
            console.log("PHProductImgs is created");
        },
        mounted() {
            console.log("PHProductImgs is created");
        }
    }
</script>

<style scoped>

</style>
