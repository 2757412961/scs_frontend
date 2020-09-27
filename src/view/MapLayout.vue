<template>
  <div style="position: absolute;bottom:0;top:61px;right:0px;left:0px">

    <!--    right:60px-->
    <div id="scsmap" style="">

    </div>
    <div id="scale-position" style="position:absolute;left:10px;bottom:20px;"></div>
    <div id="mouse-position" style="position:absolute;left:19px;bottom:5px;"></div>

    <!-- pop up -->
    <div id="popup" class="ol-popup" :style={minWidth:ol_popup_min_width}>
      <div id="popup-title" class="popup-title">{{popup_title}}</div>
      <div id="popup-content"></div>
    </div>

  </div>

</template>

<script>
    import Map from 'ol/Map'
    import View from 'ol/View'
    import XYZ from "ol/source/XYZ";
    // import TileLayer from "ol/layer/Tile";
    import 'ol/ol.css'
    import {fromLonLat, getTransform} from 'ol/proj';
    import {toLonLat} from 'ol/proj.js';
    import Select from 'ol/interaction/Select';
    import {singleClick} from 'ol/events/condition';
    import MousePosition from 'ol/control/MousePosition.js';
    import {createStringXY} from 'ol/coordinate.js';
    import {ScaleLine, defaults as defaultControls} from 'ol/control.js';
    import 'ol/ol.css';
    import Overlay from 'ol/Overlay';
    import Feature from 'ol/Feature';
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
    import Stystyle from 'ol/style/Style';
    import {transform} from 'ol/proj';

    import Geometry from 'ol/geom/Geometry';
    import Point from 'ol/geom/Point';
    import MultiPoint from 'ol/geom/MultiPoint';
    import LinearRing from 'ol/geom/LinearRing';
    import LineString from 'ol/geom/LineString';
    import Polygon from 'ol/geom/Polygon';


    import util from "../util/util";
    import mapLayout from "../util/mapLayout";
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
                typh_layer: null, // 点图层
                typh_route_layer: null, // 路线图层
                typh_move_layer: null, // 移动点图层
                typh_wind_layer: null, // 风圈图层
                typh_forecast_layer: null, // 预报 图层
                typh_Rotation_Interval: null, // 移动点自转 定时器
                typh_Rotation_Angle: null, // 旋转角度
                typh_move_setTime: null, // 台风路径移动 计时器

                //记录当前地图缩放层级
                oldZoom: 0,

                //popup三兄弟
                overlay: "",
                container: "",
                popup_title: "",
                content: "",
                ol_popup_min_width: "300px",

                //记录上一次光标指向的feature，用于方法缩小指定feature
                lastPointerFeature: null,


                // 静态资源导入 asserts
                typh_img: require('../assets/typh.png'),
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
                    chName: "台风点图层",
                    source: typh_source
                });

                var typh_route_source = new Vector({
                    features: null
                });
                this.typh_route_layer = new VectorLayer({
                    name: "typh_route_layer",
                    chName: "台风路径图层",
                    source: typh_route_source
                });

                var typh_point_source = new Vector({
                    features: null
                });
                this.typh_move_layer = new VectorLayer({
                    name: "typh_move_layer",
                    chName: "台风移动点图层",
                    source: typh_point_source
                });

                var typh_wind_source = new Vector({
                    features: null
                });
                this.typh_wind_layer = new VectorLayer({
                    name: "typh_wind_layer",
                    chName: "台风风圈图层",
                    source: typh_wind_source
                });

                var typh_forcast_source = new Vector({
                    features: null
                });
                this.typh_forecast_layer = new VectorLayer({
                    name: "typh_forecast_layer",
                    chName: "台风风圈图层",
                    source: typh_forcast_source
                });

                /** xxx图层初始化 */


                /** 视图初始化*/
                var view = new View({
                    center: fromLonLat([113.8, 22.45]),
                    zoom: 4,
                    minZoom: 2,
                    maxZoom: 8,
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
                    layers: [map_layer, this.typh_wind_layer, this.typh_forecast_layer, this.typh_route_layer, this.typh_layer, this.typh_move_layer],
                    view: view,
                    controls: defaultControls().extend([mousePositionControl, ScaleControl]),
                });

                /**
                 * Elements that make up the popup. 借鉴与深中项目
                 */
                this.container = document.getElementById('popup');
                this.content = document.getElementById('popup-content');
                this.overlay = new Overlay({
                    element: this.container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 2500
                    },
                    offset: [10, -20],
                    positioning: 'center-center',
                });
                this.map.addOverlay(this.overlay);


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
                var feature = features[0];
                if (feature.get('name').search(/NOT/) != -1) {
                    this.not = null;
                } else if (feature.get('name').search(/typhPointFeature/) != -1) {
                    let typhRouteInfo = feature.get('data');
                    if (typhRouteInfo != null) {
                        this.typhWindDraw(typhRouteInfo, 0.01);
                        this.typhForecastDraw(typhRouteInfo);
                    }
                }

                return;
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
                    var features = this.map.getFeaturesAtPixel(pixel);
                    var feature = features[0];

                    if (feature.get('name').search(/Point/) != -1) {
                        if (feature != this.lastpointerFeature) {
                            //移动前后是不同feature，将原来的feature图标大小回归正常
                            if (this.lastpointerFeature != null) {
                                var style = this.lastpointerFeature.getStyle();
                                style.getImage().setScale(1);
                                this.lastpointerFeature.setStyle(style);
                                this.overlay.setPosition(undefined);
                            }
                            this.lastpointerFeature = feature; //记录本次feature
                            var style = this.lastpointerFeature.getStyle();
                            style.getImage().setScale(1.5); //图标放大
                            this.lastpointerFeature.setStyle(style);

                            if (feature.get('name').search(/NOT/) != -1) {
                                this.siteId = 1;
                            } else if (feature.get('name').search(/typhPointFeature/) != -1) {
                                this.typhPointPopup(feature);
                            } else if (feature.get('name').search(/typhForecastFeature/) != -1) {

                            }
                        }
                    }
                    else if(feature.get('name').search(/seaArea/) != -1){
                      //如果移动到新的feature，修改feature样式
                      if (this.lastPointerFeature !== feature){ //鼠标移动到了新的feature
                        let featureStyle = feature.getStyle();  //记录本次feature的样式
                        if (this.lastPointerFeature != null){  //如果上次feature不为空，将值设置为上一feature的样式
                          this.lastPointerFeature.setStyle(featureStyle);
                        }
                        let highlightStyle = new Style({  //鼠标覆盖，创建新的feature样式
                          stroke: new Stroke({
                            color: '#3681AA',
                            width: 2
                          }),
                          fill: new Fill({
                            color: 'rgba(54, 129, 170,1)'
                          }),
                        });
                        feature.setStyle(highlightStyle);
                      }
                      //显示feature信息
                      let id_feature = feature.get('feature_id');
                      let forecastData = feature.get('feature_data');

                      this.lastPointerFeature = feature; //记录本次feature
                    }
                } else {
                    if (this.lastpointerFeature != null) {
                        var style = this.lastpointerFeature.getStyle();
                        style.getImage().setScale(1);
                        this.lastpointerFeature.setStyle(style);
                    }
                    this.overlay.setPosition(undefined);
                    this.lastpointerFeature = null;//记录本次feature
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
             * 地图要素清空
             */
            clearLayerSource() {
                //台风图层
                this.typh_layer.getSource().clear();
                this.typh_route_layer.getSource().clear();
                this.typh_move_layer.getSource().clear();
                this.typh_wind_layer.getSource().clear();
                this.typh_forecast_layer.getSource().clear();


                // 清除台风路线绘制和定时器
                clearInterval(this.typh_move_setTime);
                clearInterval(this.typh_Rotation_Interval);
                this.typh_Rotation_Interval = null;
                this.typh_Rotation_Angle = 0;
            },

            /**
             * 平滑移动至地图
             * 缩放等级
             */
            moveViewTo(x, y, z = 6) {
                this.oldZoom = z;
                this.map.getView().animate({
                    center: [x, y],
                    zoom: z,
                    duration: 1000,
                })
            },

            /**
             * 台风 点 popup
             */
            typhPointPopup(feature) {
                var typhRouteInfo = feature.get('data');

                //构建Popup_title文字内容
                this.ol_popup_min_width = "270px";
                this.popup_title = typhRouteInfo.typhNum + "号台风最新数据";

                if (typhRouteInfo != null) {
                    //组织弹出框内容
                    // var html =
                    //     "<table>" +
                    //     // "<tr><th align='left'>" + "海浪" + "</th><th align='left'>" + `util`.formatDateTime(new Date(buoy4New.buoywvnew.dt)) + "</th></tr>" +
                    //     "<tr><td align='left'>路径时间：</td><td align='left'>" + typhRouteInfo.routeTime + "</td></tr>" +
                    //     "<tr><td align='left'>中心位置：</td><td align='left'>" + typhRouteInfo.lon + "</td></tr>" +
                    //     "<tr><td align='left'>风速：</td><td align='left'>" + typhRouteInfo.windSpeed + " 米/秒" +"</td></tr>" +
                    //     "<tr><td align='left'>七级风圈半径：</td><td align='left'>" + typhRouteInfo.radius7 + " 公里" +"</td></tr>" +
                    //     "<tr><td align='left'>十级风圈半径：</td><td align='left'>" + typhRouteInfo.radius10 + " 公里" +"</td></tr>" +
                    //     "<tr><td align='left'>十二级风圈半径：</td><td align='left'>" + typhRouteInfo.radius12 + " 公里" +"</td></tr>" +
                    //     "<tr><td align='left'>中心压强：</td><td align='left'>" + typhRouteInfo.centPres +" hpa" + "</td></tr>" +
                    //     "<tr><td align='left'>强度：</td><td align='left'>" +"("+ typhRouteInfo.strength +")"+ "</td></tr>" +
                    //     "</table>";
                    var strength_CNName = mapLayout.colorTyphStrength[typhRouteInfo.strength].CN_Name;
                    var html = `
                        <table>
                          <tr><td align='left'>路径时间：</td><td align='left'>${typhRouteInfo.routeTime}</td></tr>
                          <tr><td align='left'>中心位置：</td><td align='left'>${typhRouteInfo.lon}°E, ${typhRouteInfo.lat}°N</td></tr>
                          <tr><td align='left'>风速：</td><td align='left'>${typhRouteInfo.windSpeed} 米/秒</td></tr>
                          <tr><td align='left'>七级风圈半径：</td><td align='left'>${typhRouteInfo.radius7} 公里</td></tr>
                          <tr><td align='left'>十级风圈半径：</td><td align='left'>${typhRouteInfo.radius10} 公里</td></tr>
                          <tr><td align='left'>十二级风圈半径：</td><td align='left'>${typhRouteInfo.radius12} 公里</td></tr>
                          <tr><td align='left'>中心压强：</td><td align='left'>${typhRouteInfo.centPres} hpa</td></tr>
                          <tr><td align='left'>强度：</td><td align='left'>${strength_CNName}(${typhRouteInfo.strength})</td></tr>
                        </table>
                    `.trim();
                    this.content.innerHTML = html;
                    this.overlay.setPosition(feature.getGeometry().getCoordinates());
                }
            },

            /**
             * 台风 风圈 绘制
             */
            typhWindDraw(typhRouteInfo, scale) {
                this.typh_wind_layer.getSource().clear();

                let colorTyphWind = mapLayout.colorTyphWind;
                let cenX = typhRouteInfo.lon;
                let cenY = typhRouteInfo.lat;
                let radiusJSON = JSON.parse(typhRouteInfo.radiusJson);
                let typhoonRadius = radiusJSON.TyphoonRadius;

                for (let level in typhoonRadius) {
                    let radius = typhoonRadius[level];
                    let rs = [
                        radius['NORTHEAST'] * scale,
                        radius['SOUTHEAST'] * scale,
                        radius['SOUTHWEST'] * scale,
                        radius['NORTHWEST'] * scale
                    ];
                    let angles = [0, 90, 180, 270];
                    let points = [];

                    for (let ri = 0; ri < 4; ri++) {
                        for (let quad = 0; quad <= 90; quad++) {
                            let angle = angles[ri] + quad;
                            let x = cenX + rs[ri] * Math.sin(angle / 180 * Math.PI);
                            let y = cenY + rs[ri] * Math.cos(angle / 180 * Math.PI);

                            points.push(fromLonLat([x, y]));
                        }
                    }
                    points.push(fromLonLat([cenX + rs[0] * Math.sin(0), cenY + rs[0] * Math.cos(0)]));

                    // var polygonWind = new Polygon([points]);
                    // polygonWind.applyTransform(getTransform('EPSG:4326', 'EPSG:3857'));
                    // var featureWind = new Feature(polygonWind);
                    var featureWind = new Feature(new LineString(points));
                    featureWind.set('name', 'typhWindLineFeature');
                    featureWind.setStyle(new Style({
                        stroke: new Stroke({
                            lineDash: [1, 2, 3, 4, 5, 6],
                            width: 2,
                            color: colorTyphWind[level].color
                        })
                    }));
                    this.typh_wind_layer.getSource().addFeature(featureWind);
                }
            },

            /**
             * 台风 预报路径和点 绘制
             */
            typhForecastDraw(typhRouteInfo) {
                this.typh_forecast_layer.getSource().clear();

                let colorTyphForecast = mapLayout.colorTyphForecast;
                let cenX = typhRouteInfo.lon;
                let cenY = typhRouteInfo.lat;


            },

            /**
             * 绘制台风路径
             */
            typhRoute() {
                var that = this;
                globalBus.$on('addTyphMonitor', (val, oldVal) => {
                    console.log('I AM HERE!!!!');
                    // 需要删除原有图层或已有要素
                    // 路由跳转时，自动删除
                    this.clearLayerSource();

                    if (val == null || val.length <= 0) {
                        return;
                    }

                    var that = this;
                    let len = val.length;
                    let lonlat = [];
                    let coordinates = [];
                    for (let i = 0; i < val.length; i++) {
                        lonlat[i] = [val[i]['lon'], val[i]['lat']];
                        coordinates[i] = fromLonLat([val[i]['lon'], val[i]['lat']]);
                    }

                    var center = [(coordinates[0][0] + coordinates[len - 1][0]) / 2, (coordinates[0][1] + coordinates[len - 1][1]) / 2];
                    var distance = Math.sqrt(Math.pow(lonlat[0][0] - lonlat[len - 1][0], 2) + Math.pow(lonlat[0][1] - lonlat[len - 1][1], 2));
                    // this.moveViewTo(center[0], center[1], distance);
                    this.moveViewTo(center[0], center[1]);

                    // 初始点-------------------------------------------------------------------------------------------
                    var iconStyle = new Style({
                        image: new Icon({
                            src: this.typh_img,
                            color: '#FFFFFF',
                            scale: 0.4,
                            opacity: 0.9,
                            // rotateWithView: true,
                            rotation: 0,
                        })
                    });
                    var moveFeature = new Feature(new Point(fromLonLat([val[0]['lon'], val[0]['lat']])));
                    moveFeature.setStyle(iconStyle);
                    moveFeature.set('name', "typrMoveFeature");
                    this.typh_move_layer.getSource().addFeature(moveFeature);

                    // 第一个点
                    var pointGeom = new Point(fromLonLat([val[0]['lon'], val[0]['lat']]));
                    var pointFeature = new Feature(pointGeom);
                    pointFeature.set('name', "typhPointFeature");
                    pointFeature.set('data', val[0]);
                    pointFeature.setStyle(new Stystyle({
                        image: new CircleStyle({
                            radius: 5,
                            fill: new Fill({
                                color: mapLayout.colorTyphStrength[pointFeature.get('data')['strength']].color
                            })
                        })
                    }));
                    this.typh_layer.getSource().addFeature(pointFeature);
                    // 结束初始化，开始绘制 ------------------------------------------------------------------------------

                    // 最后一个标记点的坐标
                    var index = 1;

                    function drawTyph() {
                        // 退出time计时器
                        if (index >= val.length) {
                            // 自转绘制
                            that.typh_Rotation_Interval = setInterval(function () {
                                that.typh_Rotation_Angle = that.typh_Rotation_Angle >= 360 ? 0 : that.typh_Rotation_Angle + 1;
                                that.typh_move_layer.getSource().getFeatures()[0].getStyle().getImage().setRotation(that.typh_Rotation_Angle);
                                that.typh_move_layer.getSource().changed();
                            }, 100);
                            clearInterval(that.typh_move_setTime);
                            return;
                        }

                        // 台风移动点绘制
                        that.typh_move_layer.getSource().clear();
                        var moveFeature = new Feature(new Point(fromLonLat([val[index]['lon'], val[index]['lat']])));
                        moveFeature.set('name', 'typhMoveFeature');
                        moveFeature.setStyle(iconStyle);
                        that.typh_move_layer.getSource().addFeature(moveFeature);

                        // 台风点等级的渲染
                        var pointFeature = new Feature(
                            new Point(fromLonLat([val[index]['lon'], val[index]['lat']]))
                        );
                        pointFeature.set("name", "typhPointFeature");
                        pointFeature.set("data", val[index]);
                        pointFeature.setStyle(new Stystyle({
                            image: new CircleStyle({
                                radius: 5,
                                fill: new Fill({
                                    color: mapLayout.colorTyphStrength[pointFeature.get('data')['strength']].color
                                })
                            })
                        }));
                        that.typh_layer.getSource().addFeature(pointFeature);

                        // 台风轨迹线的绘制
                        var lineFeature = new Feature(
                            new LineString([
                                fromLonLat([val[index - 1]['lon'], val[index - 1]['lat']]),
                                fromLonLat([val[index]['lon'], val[index]['lat']]),
                            ])
                        );
                        lineFeature.set('name', "typhLineFeature");
                        lineFeature.set('strength', val[index]['strength']);
                        lineFeature.setStyle(new Stystyle({
                                stroke: new Stroke({
                                    color: mapLayout.colorTyphStrength[lineFeature.get("strength")].color,
                                    width: 3
                                }),
                                // image: new CircleStyle({
                                //     radius: 2,
                                //     fill: new Fill({
                                //         color: '#f00'
                                //     })
                                // })
                            })
                        );
                        that.typh_route_layer.getSource().addFeature(lineFeature);

                        index += 1;
                        that.typh_move_setTime = setTimeout(drawTyph, 10);
                    }

                    drawTyph();


                });
            },

          //  *****************************seaArea 近海预报  start******************************************
          seaAreaList2Polygon(ptArr){
            let areaPolygonPts = new Array();
            let areaPolygon = new Array();
            for (let i=0; i<ptArr.length; i++){
              let temp = [ptArr[i].x, ptArr[i].y];
              areaPolygon.push(temp);
            }
            areaPolygonPts.push(areaPolygon);
            return areaPolygonPts;
          },
          seaAreaCreatePolygonFeature: function(points, name, id, forecastData) {
            var polygonFeature = new Feature({
              geometry: new Polygon(points),
              name:'seaArea',
            })
            polygonFeature.set('feature_id', id)
            polygonFeature.set('feature_data', forecastData)
            return polygonFeature
          },
          seaAreaCreateVectorLayer: function( vectorSource_seaArea) {
            this.vectorLayer = new VectorLayer({ // 这里定义的是图层类型(Image/Title/Vector)
              source: vectorSource_seaArea,
              style: new Style({
                stroke: new Stroke({
                  color: '#3681AA',
                  width: 2
                }),
                fill: new Fill({
                  color: 'rgba(54,129,170,0.1)'
                })
              })
            })
            return this.vectorLayer
          },
          seaAreaDrawPolygon(){
            globalBus.$on('drawSeaArea',(areaList, areaForecastData) => {
              let vectorSource_seaArea = new VectorSource();
              // 海区列表 和 预报数据 是对应的
              for (let i=0; i<areaList.length; i++){
                // 转换polygon
                let polygons = this.seaAreaList2Polygon(areaList[i].pt);
                // 创建feature，加入要显示的预报数据(第一个数据)
                if(areaList[i].area == areaForecastData[i].data[0].hqbh){ //判断海区是否一致，根据编号
                  vectorSource_seaArea.addFeature(this.seaAreaCreatePolygonFeature(polygons, areaList[i].alias, areaList[i].area, areaForecastData[i].data[0]));
                } else { //如果位置不对应，遍历 areaForecastData，寻找对应预报数据
                  for (let j=0; j<areaForecastData.length; j++){
                    if (areaForecastData[j].data[0].hqbh == areaList[i].area){
                      vectorSource_seaArea.addFeature(this.seaAreaCreatePolygonFeature(polygons, areaList[i].alias, areaList[i].area, areaForecastData[i].data[0]));
                    }
                  }
                }
              }
              let seaAreVectorLayer = this.seaAreaCreateVectorLayer(vectorSource_seaArea);
              this.map.addLayer(seaAreVectorLayer);
            })
          },
          seaAreaForecastPopShow(feature){

          },

          //  *****************************seaArea 近海预报   end******************************************


        },

        mounted: function () {
            this.mapInit();
            this.typhRoute();
            this.seaAreaDrawPolygon();
        },
        destroyed() {
            console.log("MapLayout is destroyed");
        }
    }

</script>

<style>
  #scsmap {
    height: 100%;
    width: 100%;
    position: absolute;
  }

  #scsmap .ol-zoom .ol-zoom-out {
    margin-top: 204px;
  }

  #scsmap .ol-zoomslider {
    background-color: transparent;
    top: 2.3em;
  }

  #scsmap .ol-touch .ol-zoom .ol-zoom-out {
    margin-top: 212px;
  }

  #scsmap .ol-touch .ol-zoomslider {
    top: 2.75em;
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

  .popover {
    max-width: 1000px;
  }


</style>
