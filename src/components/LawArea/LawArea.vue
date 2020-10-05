<template>
  <div>
    <el-row>
      <el-col>
        <button @click="drawLawArea">nishigeerhuoma</button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import {globalBus} from "../globalBus";
    import mapLayout from "../../util/mapLayout";


    export default {
        name: "LawArea",
        data() {
            return {
                // 执法海域json
                lawAreaJson: require('../../../static/resources/LawArea.json'),
                lawAreaName: "",
                lawAreaData: [{}],


            }
        },
        methods: {
            drawLawArea() {
                globalBus.$emit('lawAreaDraw', this.lawAreaJson);
            },
            changeLawAreaName() {
                globalBus.$on('changeLawAreaName', (newName) => {
                    this.lawAreaName = newName;
                });
            },


        },
        watch: {
            lawAreaName: function () {

            }
        },
        beforeCreate() {

        },
        created() {
            console.log("LawArea is created");
        },
        beforeMount() {

        },
        mounted() {
            console.log("LawArea is mounted");
            this.drawLawArea();
            this.changeLawAreaName();
        },
        beforeUpdate() {

        },
        updated() {

        },
        beforeDestroy() {

        },
        destroyed() {
            console.log("LawArea is destroyed");
        }
    }
</script>

<style scoped>

</style>
