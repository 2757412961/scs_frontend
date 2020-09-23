<template>
  <div style="position: absolute;bottom:0;top:61px;right:0px;left:0px">
    <!--    right:60px-->
    <div id="scsmap" style="">

    </div>
    <div id="scale-position" style="position:absolute;left:10px;bottom:20px;"></div>
    <div id="mouse-position" style="position:absolute;left:19px;bottom:5px;"></div>
  </div>

</template>

<script>
    import Map from 'ol/Map'
    import View from 'ol/View'
    import XYZ from "ol/source/XYZ";
    // import TileLayer from "ol/layer/Tile";
    import 'ol/ol.css'
    import {fromLonLat} from 'ol/proj';
    import {toLonLat} from 'ol/proj.js';
    import Select from 'ol/interaction/Select';
    import {singleClick} from 'ol/events/condition';
    import MousePosition from 'ol/control/MousePosition.js';
    import {createStringXY} from 'ol/coordinate.js';
    import {ScaleLine, defaults as defaultControls} from 'ol/control.js';
    import 'ol/ol.css';
    import Feature from 'ol/Feature';
    import Point from 'ol/geom/Point';
    import Polyline from 'ol/format/Polyline';
    import VectorSource from 'ol/source/Vector';
    import {Vector} from 'ol/source'
    import {
        Circle as CircleStyle,
        Fill,
        Icon,
        Stroke,
        Style,
    } from 'ol/style';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
    import {getVectorContext} from 'ol/render';
    import ImageLayer from 'ol/layer/Image';
    import ImageStaticSource from 'ol/source/ImageStatic';
    import LineString from 'ol/geom/LineString';
    import Stystyle from 'ol/style/Style';
    import Geometry from 'ol/geom/Geometry';
    import {transform} from 'ol/proj';
    import MultiPoint from 'ol/geom/MultiPoint';


    import {globalBus} from '../components/globalBus';

    // .vue文件 单文件组件 component
    export default {
        name: "map-layout",
        components: {},
        data() {
            return {
                map: null,//地图
                sea_area_layer: null,//近海海区图层
                zfhy_area_layer: null,//执法海域图层
                pro_layers: [],//数值预报产品图层

                //台风图层
                typh_layer: null,

                //记录当前地图缩放层级
                oldZoom: 0
            }
        },
        created() {

        },
        methods: {

            /**
             * 地图初始化
             */
            mapInit() {

                /** 地图图层初始化 */
                    //"http://"+this.$store.state.serverIP+"/tianditu/tdt/{z}/{y}/{x}.jpg"
                    //"http://"+this.$store.state.serverIP+"/FeatureWithLabelGZA/{z}/{x}/{y}.jpg"
                var map_source = new XYZ({
                        url: "http://" + this.$store.state.serverIP + "/TerrainWithLabel/{z}/{x}/{y}.jpg"    //FeatureWithLabelGZA
                    });
                var map_layer = new TileLayer({
                    source: map_source
                });

                /** 台风图层初始化 */
                var typh_source = new Vector({
                    features: null
                });
                this.typh_layer = new VectorLayer({
                    name: "typh_layer",
                    chName: "台风图层",
                    source: typh_source
                });

                /** 视图初始化*/
                var view = new View({
                    center: fromLonLat([113.8, 22.45]),
                    zoom: 4,
                    minZoom: 2,
                    maxZoom: 9,
                });
                this.oldZoom = 10;

                //mousePosition初始化
                var mousePositionControl = new MousePosition({
                    coordinateFormat: createStringXY(4),
                    projection: 'EPSG:4326',
                    // comment the following two lines to have the mouse position
                    // be placed within the map.
                    className: 'custom-mouse-position',
                    target: document.getElementById('mouse-position'),
                    undefinedHTML: '&nbsp;'
                });

                var ScaleControl = new ScaleLine({
                    units: "metric",
                    bar: true,
                    steps: 2,
                    text: false,
                    minWidth: 140,
                    target: document.getElementById('scale-position'),
                });

                /** Map初始化*/
                this.map = new Map({
                    target: "scsmap",
                    layers: [map_layer, this.typh_layer],
                    view: view,
                    controls: defaultControls().extend([mousePositionControl, ScaleControl]),
                });


                //鼠标移动事件绑定
                this.map.on('pointermove', this.mouseMove);
                //鼠标点击地图响应事件绑定
                this.map.on('singleclick', this.singleClickOnMap);
                //地图范围变化事件绑定
                this.map.on('moveend', this.zoomEvent);

                //鼠标点击feature事件绑定
                var selectClick = new Select({
                    condition: singleClick,
                    multi: true,
                });
                this.map.addInteraction(selectClick);
                selectClick.on("select", this.singleClick);
            },


            /**
             * 点击feature响应事件(只有在选中Feature时才会触发）
             * @param e
             */
            singleClick(e) {
                var features = e.target.getFeatures().getArray();

            },

            /**
             * 地图区域鼠标移动事件
             * @param e
             */
            mouseMove(e) {
                var pixel = e.pixel;//获取地图上坐标
                var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
                this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';//变换鼠标指针的状态
                //如果触到feature
                if (hit) {

                } else {

                }

            },

            /**
             * 地图区域鼠标点击事件
             * @param e
             */
            singleClickOnMap(e) {
                //如果点击处有feature则返回
                var pixel = e.pixel;//获取地图上坐标
                var lonlat = toLonLat(this.map.getCoordinateFromPixel(e.pixel));
                var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
                if (hit) {
                    return;
                } else {

                }

            },

            /**
             * 判断地图是否缩放，
             * 若缩放，则判断是否有数据产品图层
             * 如果有，则更新数据产品层级
             * @param e
             */
            zoomEvent(e) {
                //判断地图是否缩放,无缩放则返回
                var zoom = this.map.getView().getZoom();  //获取当前地图的缩放级别
                if (this.oldZoom == zoom)
                    return;
                //若缩放，记录当前缩放层级
                this.oldZoom = zoom;

                //判断是否有数据产品图层，若无则返回
                //若有数据产品图层，则更新数据产品层级
            },

            /**
             * 设置地图中心
             *
             */
            // setCenter(x, y, z = 4) {
            //     map.setCenter(new OpenLayers.LonLat(x, y), z);
            // },

            /**
             * 绘制台风路径
             */
            typhRoute() {
                var that = this;
                globalBus.$on('addTyphMonitor', (val, oldVal) => {
                    // 需要删除原有图层或已有要素！！
                    // vectorLayer.getSource().removeFeature(pop[1]);
                    this.typh_layer.getSource().clear();

                    let typhColor = {
                        "TD": {
                            name: "热带低压",
                            color: "#00F806"
                        },
                        "TS": {
                            name: "热带风暴",
                            color: "#0062FF"
                        },
                        "STS": {
                            name: "强热带风暴",
                            color: "#FFF500"
                        },
                        "TY": {
                            name: "台风",
                            color: "#F8AD09"
                        },
                        "STY": {
                            name: "强台风",
                            color: "#F56CF0"
                        },
                        "SUPERTY": {
                            name: "超强台风",
                            color: "#FA020b"
                        },
                    };

                    if (val.length <= 0) {
                        return;
                    }

                    var newView = new View({
                        center: fromLonLat([val[0]['lon'], val[0]['lat']]),
                        zoom: 6,
                    });
                    this.oldZoom = 6;
                    this.map.setView(newView);

                    var coordinate = [];
                    var coordinateDraw = [];

                    for (var i = 0; i < val.length; i++) {
                        coordinate.push(transform([val[i]['lon'], val[i]['lat']], 'EPSG:4326', 'EPSG:3857'));
                    }

                    coordinateDraw.push(coordinate[0]);
                    var geometry = new LineString(coordinateDraw);
                    var LineStringFeature = new Feature(geometry);

                    //实例化一个矢量图层Vector作为绘制层
                    var source = new Vector();
                    //将线添加到Vector绘制层上
                    source.addFeature(LineStringFeature);

                    var vectorLayer = new VectorLayer({
                        source: source,
                        style: new Stystyle({
                            stroke: new Stroke({
                                color: '#f00',
                                width: 2
                            }),
                            image: new CircleStyle({
                                radius: 2,
                                fill: new Fill({
                                    color: '#f00'
                                })
                            })
                        })
                    });
                    this.map.addLayer(vectorLayer);


                    // 台风等级的渲染还没写
                    // 鼠标移到台风和点击的事件还没写


                    var pointGeom = new Point(fromLonLat([val[0]['lon'], val[0]['lat']]));
                    var pointFeature = new Feature(pointGeom);
                    pointFeature.set("strength", val[0]['strength']);
                    pointFeature.setStyle(new Stystyle({
                        image: new CircleStyle({
                            radius: 5,
                            fill: new Fill({
                                color: '#ff3df4'
                            })
                        })
                    }));
                    this.typh_layer.getSource().addFeature(pointFeature);

                    var sourcepoint = new VectorSource();
                    sourcepoint.addFeature(pointFeature);

                    var pointLayer = new VectorLayer({
                        source: sourcepoint,
                        // style: function (feature, resolution) {
                        //     var strength = feature.get("strength");
                        //     var color = typhColor[strength].color;
                        //
                        //     return new Stystyle({
                        //         image: new CircleStyle({
                        //             radius: 5,
                        //             fill: new Fill({
                        //                 color: color
                        //             })
                        //         })
                        //     })
                        // },

                        // style:
                        //     new Stystyle({
                        //         image: new CircleStyle({
                        //             radius: 2,
                        //             fill: new Fill({
                        //                 color: 'rgba(14,11,133,0.9)'
                        //             })
                        //         })
                        //     })
                    });
                    // this.map.addLayer(pointLayer);

                    // 最后一个标记点的坐标
                    var that = this;
                    var index = 1;
                    // var interval = setInterval(function () {
                    //     var newPoint = [coordinate[index][0], coordinate[index][1]];
                    //     coordinateDraw.push(newPoint);
                    //     geometry.setCoordinates(coordinateDraw);
                    //
                    //
                    //     var pointFeature1 = new Feature(
                    //         new Point(fromLonLat([val[index]['lon'], val[index]['lat']]))
                    //     );
                    //     pointFeature1.set("strength", val[index]['strength']);
                    //     pointFeature1.setStyle(new Stystyle({
                    //         image: new CircleStyle({
                    //             radius: 5,
                    //             fill: new Fill({
                    //                 color: typhColor[pointFeature1.get("strength")].color
                    //             })
                    //         })
                    //     }));
                    //     that.typh_layer.getSource().addFeature(pointFeature1);
                    //
                    //     index += 1;
                    // }, 30);
                    //
                    // setTimeout(function () {
                    //     clearInterval(interval);
                    // }, 30 * coordinate.length);

                    var st;

                    function drawTyph() {
                        if (index >= val.length) {
                            clearInterval(t);
                            return;
                        }

                        var newPoint = [coordinate[index][0], coordinate[index][1]];
                        coordinateDraw.push(newPoint);
                        geometry.setCoordinates(coordinateDraw);


                        var pointFeature1 = new Feature(
                            new Point(fromLonLat([val[index]['lon'], val[index]['lat']]))
                        );
                        pointFeature1.set("strength", val[index]['strength']);
                        pointFeature1.setStyle(new Stystyle({
                            image: new CircleStyle({
                                radius: 5,
                                fill: new Fill({
                                    color: typhColor[pointFeature1.get("strength")].color
                                })
                            })
                        }));
                        that.typh_layer.getSource().addFeature(pointFeature1);

                        index += 1;

                        st = setTimeout(drawTyph, 300);
                    }

                    drawTyph();

                    // for (let i = 1; i < coordinate.length; i++) {
                    //     setTimeout(
                    //         function () {
                    //             var newPoint = [coordinate[i][0], coordinate[i][1]];
                    //             coordinateDraw.push(newPoint);
                    //             geometry.setCoordinates(coordinateDraw);
                    //             // pointGeom.setCoordinates(coordinateDraw);
                    //
                    //             // var pointFeature1 = new Feature(
                    //             //     new Point(fromLonLat([val[i]['lon'], val[i]['lat']]))
                    //             // );
                    //             // pointFeature1.set("strength", val[i]['strength']);
                    //             // pointFeature1.setStyle(new Stystyle({
                    //             //     image: new CircleStyle({
                    //             //         radius: 5,
                    //             //         fill: new Fill({
                    //             //             color: typhColor[val[i]['strength']].color
                    //             //         })
                    //             //     })
                    //             // }));
                    //             // that.typh_layer.getSource().addFeature(pointFeature1);
                    //             // pointLayer.getSource().addFeature(pointFeature);
                    //
                    //         }, 1000);
                    // }


                });
            }

        },

        mounted: function () {
            this.mapInit();
            this.typhRoute();
        }
    }
</script>

<style scoped>
  #scsmap {
    height: 100%
  }

  ol-viewport {
    /*完全透明*/
    background-color: rgba(0, 0, 0, 0);
    /*完全不透明*/
    /*background-color: rgba(0, 0, 0, 1);*/
  }

  .ol-popup {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.85);
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 210px;
    /*opacity: 0.5; !*透明度 *!*/
  }

  .ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }

  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }

  .popup-title {
    font-weight: bold;
    border-bottom: 1px solid #cccccc;
    /*padding: 5px 8px;*/
  }

  .popup-content {
    padding: 5px 8px;
  }

  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }

  .ol-popup-closer:after {
    content: "✖";
  }
</style>
