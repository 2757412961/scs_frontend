<template>
  <div style="position: absolute;bottom:0;top:61px;right:0px;left:0px">

    <!--    right:60px-->
    <div id="scsmap" style="">

    </div>
    <div id="fullScreen-position" style="position:fixed;   left:10px; bottom:320px;"></div>
    <div id="zoomToExtent-position" style="position:fixed; left:1px;  top:265px;"></div>
    <div id="overviewMap-position" style="position:fixed;  left:33px;  top:352px;"></div>
    <div id="scale-position" style="position:absolute;     left:10px; bottom:20px;"></div>
    <div id="mouse-position" style="position:absolute;     left:19px; bottom:5px;"></div>

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
    import {transform, Projection} from 'ol/proj';
    import {fromLonLat, getTransform} from 'ol/proj';
    import {toLonLat} from 'ol/proj.js';
    import Select from 'ol/interaction/Select';
    import {singleClick} from 'ol/events/condition';

    // 地图控件
    import ZoomSlider from 'ol/control/ZoomSlider';
    import FullScreen from 'ol/control/FullScreen';
    import OverviewMap from 'ol/control/OverviewMap';
    import ZoomToExtent from 'ol/control/ZoomToExtent';
    import MousePosition from 'ol/control/MousePosition.js';
    import {ScaleLine, defaults as defaultControls} from 'ol/control.js';

    import {createStringXY} from 'ol/coordinate.js';
    import 'ol/ol.css';
    import Overlay from 'ol/Overlay';
    import Feature from 'ol/Feature';
    import Polyline from 'ol/format/Polyline';
    import VectorSource from 'ol/source/Vector';
    import {Vector} from 'ol/source'
    import ImageStaticSource from 'ol/source/ImageStatic';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
    import ImageLayer from 'ol/layer/Image';
    import {getVectorContext} from 'ol/render';

    // 样式
    import {Circle as CircleStyle, Fill, Icon, Stroke, Style, Text,} from 'ol/style';
    import Stystyle from 'ol/style/Style';
    import {asArray} from 'ol/color';

    // Geometry
    import Geometry from 'ol/geom/Geometry';
    import Point from 'ol/geom/Point';
    import MultiPoint from 'ol/geom/MultiPoint';
    import LinearRing from 'ol/geom/LinearRing';
    import LineString from 'ol/geom/LineString';
    import Polygon from 'ol/geom/Polygon';

    import Draw from 'ol/interaction/Draw';
    import {createBox} from 'ol/interaction/Draw';
    import {getCenter} from 'ol/extent'

    // 本地引用
    import util from "../util/util";
    import mapLayout from "../util/mapLayout";
    import {globalBus} from '../components/globalBus';

    // .vue文件 单文件组件 component
    export default {
        name: "map-layout",
        components: {},
        data() {
            return {
                map: null, //地图
                sea_area_layer: null, //近海海区图层
                law_area_layer: null, //执法海域图层
                // pro_layers: [], //数值预报产品图层

                //台风图层
                typh_layer: null, // 点图层
                typh_route_layer: null, // 路线图层
                typh_wind_layer: null, // 风圈图层
                typh_move_layer: null, // 移动点图层
                typh_Rotation_Interval: null, // 移动点自转 定时器
                typh_Rotation_Angle: null, // 旋转角度
                typh_move_setTime: null, // 台风路径移动 计时器

                // 台风预报图层
                typh_forecast_layer: null, // 预报 图层
                typh_forecast_feature: null, // 预报起点的 Feature
                typh_Center_layer: null, // 中心
                typh_China_layer: null, // 中国
                typh_Japan_layer: null, // 日本
                typh_Europe_layer: null, // 欧洲
                typh_USA_layer: null, // 美国
                typh_TEPO_layer: null, // TEPO
                typh_Korea_layer: null, // 韩国
                typh_Taiwan_layer: null, // 台湾
                typh_HongKong_layer: null, // 香港

                /* 格点预报 start*/
                globalNum_left_imgLayer: null,
                globalNum_right_imgLayer: null,
                globalNum_current_png: {type: '', pngUrl: ''},
                globalNum_draw: null,
                globalNum_draw_layer: null,
                globalNum_visible_extent: [],
                /* 格点预报 end*/

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

                // ol.interaction.Select,添加高亮显示和点击事件
                selectClick: null,

                // 静态资源导入 asserts
                typh_img: require('../assets/Typhoon/typh5.png'),
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
                // var map_source = new XYZ({
                //     url: "http://" + this.$store.state.serverIP + "/sztd_map/tdt_lxt/{z}/{x}/{y}.jpg"    //FeatureWithLabelGZA
                // });
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
                    chName: "台风预测图层",
                    source: typh_forcast_source
                });

                /** 台风预测图层初始化 **/
                this.typh_Center_layer = new VectorLayer({
                    name: "typh_Center_layer",
                    chName: "台风预测中心图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_China_layer = new VectorLayer({
                    name: "typh_China_layer",
                    chName: "台风预测中国图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_Japan_layer = new VectorLayer({
                    name: "typh_Japan_layer",
                    chName: "台风预测日本图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_Europe_layer = new VectorLayer({
                    name: "typh_Europe_layer",
                    chName: "台风预测欧洲图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_USA_layer = new VectorLayer({
                    name: "typh_USA_layer",
                    chName: "台风预测美国图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_TEPO_layer = new VectorLayer({
                    name: "typh_TEPO_layer",
                    chName: "台风预测TEPO图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_Korea_layer = new VectorLayer({
                    name: "typh_Korea_layer",
                    chName: "台风预测韩国图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_Taiwan_layer = new VectorLayer({
                    name: "typh_Taiwan_layer",
                    chName: "台风预测台湾图层",
                    source: new Vector({
                        features: null
                    })
                });
                this.typh_HongKong_layer = new VectorLayer({
                    name: "typh_HongKong_layer",
                    chName: "台风预测香港图层",
                    source: new Vector({
                        features: null
                    })
                });

                /** 近海海域图层初始化 */
                var sea_area_source = new Vector({
                    features: null
                });
                this.sea_area_layer = new VectorLayer({
                    name: "sea_area_layer",
                    chName: "近海海域图层",
                    source: sea_area_source
                });

                /** 执法海域图层初始化 */
                var zfhy_area_source = new Vector({
                    features: null
                });
                this.law_area_layer = new VectorLayer({
                    name: "law_area_layer",
                    chName: "执法海域图层",
                    source: zfhy_area_source
                });

                /** 智能网格预报-全球模式  图层初始化*/
                var globalNum_imgLayer_source = new ImageStaticSource({
                    url: ''
                });
                this.globalNum_left_imgLayer = new ImageLayer({
                    source: globalNum_imgLayer_source
                });
                this.globalNum_right_imgLayer = new ImageLayer({
                    source: globalNum_imgLayer_source
                });
                var globalNum_drwa_source = new Vector()
                this.globalNum_draw_layer = new VectorLayer({
                    source: globalNum_drwa_source
                });
                this.globalNum_draw = new Draw({
                    source: globalNum_drwa_source,
                    type: 'Circle',
                    dragVertexDelay: 100,
                    stopClick: true,
                    geometryFunction: createBox()
                });

                /** 视图初始化*/
                var view = new View({
                    center: fromLonLat([113.8, 22.45]),
                    zoom: 4,
                    minZoom: 2,
                    maxZoom: 8,
                });
                this.oldZoom = 10;

                // zoom 滑块
                var zoomSliderControl = new ZoomSlider();
                //添加缩放到当前视图滑动控件
                var zoomToExtentControl = new ZoomToExtent({
                    target: document.getElementById('zoomToExtent-position'),
                });
                //添加全屏控件
                var fullScreenControl = new FullScreen({
                    // target: document.getElementById('fullScreen-position'),
                });
                //添加缩略图控件
                var overviewMapControl = new OverviewMap({
                    collapsed: false,
                    target: document.getElementById('overviewMap-position'),
                });

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

                /** Map初始化 */
                this.map = new Map({
                    target: "scsmap",
                    layers: [map_layer, this.sea_area_layer, this.law_area_layer, // Polygon
                        this.typh_wind_layer, this.typh_forecast_layer, this.typh_Center_layer, // Wind
                        this.typh_China_layer, this.typh_Japan_layer, this.typh_Europe_layer, this.typh_USA_layer, // CJEU
                        this.typh_TEPO_layer, this.typh_Korea_layer, this.typh_Taiwan_layer, this.typh_HongKong_layer, // TKTH
                        this.typh_route_layer, this.typh_layer, this.typh_move_layer],
                    view: view,
                    controls: defaultControls().extend([
                        zoomSliderControl, zoomToExtentControl,
                        fullScreenControl,
                        mousePositionControl, ScaleControl
                    ]),
                });

                /**
                 * Elements that make up the popup.
                 */
                this.container = document.getElementById('popup');
                this.content = document.getElementById('popup-content');
                this.overlay = new Overlay({
                    element: this.container,
                    autoPan: false,
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
                this.selectClick = new Select({
                    condition: singleClick,
                    multi: true,
                });
                this.map.addInteraction(this.selectClick);
                this.selectClick.on("select", this.singleClick);
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
                    // 如果点击了typhPoint的feature
                    let typhRouteInfo = feature.get('data');
                    if (typhRouteInfo != null) {
                        this.typhWindDraw(typhRouteInfo, 0.01);
                        this.typh_forecast_feature = feature;
                        this.typhForecastDraw(typhRouteInfo, feature.get('typhModelNum'));
                    }
                } else if (feature.get('name').search(/seaArea/) != -1) {
                    // 如果点击了seaArea的feature
                    let id_feature = feature.get('feature_id');
                    // 调用seaArea方法，传递id
                    globalBus.$emit('updateSeaAreaDataIndex', id_feature);
                } else if (feature.get('name').search(/lawAreaPolygonFeature/) != -1) {
                    // 如果点击了lawArea的feature
                    let areaName = feature.get('areaName');
                    globalBus.$emit('changeLawAreaName', areaName);
                }

                // 清除选中要素
                this.selectClick.getFeatures().clear();

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
                        if (feature != this.lastPointerFeature) {
                            //移动前后是不同feature，将原来的feature图标大小回归正常
                            if (this.lastPointerFeature != null) {
                                var style = this.lastPointerFeature.getStyle();
                                style.getImage().setScale(1);
                                this.lastPointerFeature.setStyle(style);
                                this.overlay.setPosition(undefined);
                            }
                            this.lastPointerFeature = feature; //记录本次feature
                            var style = this.lastPointerFeature.getStyle();
                            style.getImage().setScale(1.5); //图标放大
                            this.lastPointerFeature.setStyle(style);
                        }

                        if (feature.get('name').search(/NOT/) != -1) {
                            this.siteId = 1;
                        } else if (feature.get('name').search(/typhPointFeature/) != -1) {
                            this.typhPointPopup(feature);
                        } else if (feature.get('name').search(/typhForecastPointFeature/) != -1) {
                            this.typhForecastPointPopup(feature);
                        }
                    } else if (feature.get('name').search(/seaArea/) != -1) {
                        /*//如果移动到新的feature，修改feature样式
                        if (this.lastPointerFeature !== feature) { //鼠标移动到了新的feature
                          let featureStyle = feature.getStyle();  //记录本次feature的样式
                          if (this.lastPointerFeature != null) {  //如果上次feature不为空，将值设置为上一feature的样式
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
                          this.seaAreaForecastPopup(feature, pixel); //显示弹框
                          this.lastPointerFeature = feature; //记录本次feature
                        }*/
                        this.seaAreaForecastPopup(feature, pixel);
                    } else if (feature.get('name').search(/lawAreaPolygonFeature/) != -1) {
                        this.lawAreaPolygonPopup(feature, pixel);
                    }
                } else {
                    if (this.lastPointerFeature != null) {
                        if (this.lastPointerFeature.get('name').search(/Point/) != -1) {
                            var style = this.lastPointerFeature.getStyle();
                            style.getImage().setScale(1);
                            this.lastPointerFeature.setStyle(style);
                        } else if (this.lastPointerFeature.get('name').search(/seaArea/) != -1) {
                            this.lastPointerFeature.setStyle(new Style({
                                stroke: new Stroke({color: '#429FCE', width: 2}),
                                fill: new Fill({color: '#C2D1E0'}),
                            }));
                        } else if (this.lastPointerFeature.get('name').search(/lawAreaPolygonFeature/) != -1) {
                            let oldColor = this.lastPointerFeature.getStyle().getFill().getColor();
                            oldColor[3] = 0.4;
                            this.lastPointerFeature.getStyle().getFill().setColor(oldColor);
                            this.law_area_layer.getSource().changed();
                        }
                    }
                    this.overlay.setPosition(undefined);
                    this.lastPointerFeature = null;//记录本次feature
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
                    var features = this.map.getFeaturesAtPixel(pixel);
                    var feature = features[0];


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

                // zoom有变化，globalNumericalLayer贴图变化
                this.globalNumericalZoomChange(this.globalNum_visible_extent);

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

                // 清除台风预报要素
                this.clearTyphForecastSource();
                this.typh_forecast_layer.getSource().clear();

                // 近海预报图层
                this.sea_area_layer.getSource().clear();

                // 执法海域图层
                // this.law_area_layer.getSource().clear();

                // 格点预报
                this.globalNum_draw_layer.getSource().clear();
                this.map.removeLayer(this.globalNum_left_imgLayer);
                this.map.removeLayer(this.globalNum_right_imgLayer);

                // 清除台风路线绘制和定时器
                clearInterval(this.typh_move_setTime);
                clearInterval(this.typh_Rotation_Interval);
                this.typh_Rotation_Interval = null;
                this.typh_Rotation_Angle = 0;
                this.typh_move_layer.getSource().clear();
            },
            clearMapLawAreaLayer() {
                globalBus.$on('clearMapLawAreaLayer', (s) => {
                    // this.clearLayerSource();
                    // 执法海域图层
                    this.law_area_layer.getSource().clear();
                })
            },
            /**
             * 台风预报要素要素清空
             */
            clearTyphForecastSource() {
                this.typh_Center_layer.getSource().clear();
                this.typh_China_layer.getSource().clear();
                this.typh_Japan_layer.getSource().clear();
                this.typh_Europe_layer.getSource().clear();
                this.typh_USA_layer.getSource().clear();
                this.typh_TEPO_layer.getSource().clear();
                this.typh_Korea_layer.getSource().clear();
                this.typh_Taiwan_layer.getSource().clear();
                this.typh_HongKong_layer.getSource().clear();
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
                let typhNum = typhRouteInfo.typhNum;
                let typhName = feature.get('typhName');

                //构建Popup_title文字内容
                this.ol_popup_min_width = "270px";
                this.popup_title = `${typhNum}号 ${typhName}台风最新数据`;

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
<!--                          <tr><td align='left'>十二级风圈半径：</td><td align='left'>${typhRouteInfo.radius12} 公里</td></tr>-->
                          <tr><td align='left'>中心压强：</td><td align='left'>${typhRouteInfo.centPres} hpa</td></tr>
                          <tr><td align='left'>强度：</td><td align='left'>${strength_CNName}(${typhRouteInfo.strength})</td></tr>
                        </table>
                    `.trim();
                    this.content.innerHTML = html;
                    this.overlay.setPosition(feature.getGeometry().getCoordinates());
                }
            },
            /**
             * 台风 预报点 popup
             */
            typhForecastPointPopup(feature) {
                let typhForecastInfo = feature.get('data');
                let typhForecastType = feature.get('type');
                let typhForecastStre = feature.get('strength');

                let colorTyphStrength = mapLayout.colorTyphStrength;
                let colorTyphForecast = mapLayout.colorTyphForecast;

                //构建Popup_title文字内容
                this.ol_popup_min_width = "230px";

                if (typhForecastInfo != null) {
                    if (typhForecastType == 'China') {
                        //组织弹出框内容
                        this.popup_title = `${typhForecastInfo.typhNum}号台风预测数据`;
                        var strength_CNName = colorTyphStrength[typhForecastStre].CN_Name;
                        var html = `
                        <table>
                          <tr><td align='left'>起报时间：</td><td align='left'>${util.formatDateTime(new Date(typhForecastInfo.qbsj))}</td></tr>
                          <tr><td align='left'>预报时间：</td><td align='left'>${util.formatDateTime(new Date(typhForecastInfo.ybsj))}</td></tr>
                          <tr><td align='left'>中心位置：</td><td align='left'>${typhForecastInfo.lon}°E, ${typhForecastInfo.lat}°N</td></tr>
                          <tr><td align='left'>七级风圈半径：</td><td align='left'>${typhForecastInfo.radius_7} 公里</td></tr>
                          <tr><td align='left'>十级风圈半径：</td><td align='left'>${typhForecastInfo.radius_10} 公里</td></tr>
                          <tr><td align='left'>中心压强：</td><td align='left'>${typhForecastInfo.centPres} hpa</td></tr>
                          <tr><td align='left'>强度：</td><td align='left'>${strength_CNName}(${typhForecastStre})</td></tr>
                          <tr><td align='left'>预报单位：</td><td align='left'>${colorTyphForecast[typhForecastType].CN_Name}</td></tr>
                        </table>
                    `.trim();
                    } else if (typhForecastType == 'Europe' || typhForecastType == 'USA' || typhForecastType == 'TEPO') {
                        //组织弹出框内容
                        this.popup_title = `${typhForecastInfo.idx}号台风预测数据`;
                        var strength_CNName = colorTyphStrength[typhForecastStre].CN_Name;
                        var html = `
                        <table>
                          <tr><td align='left'>起报时间：</td><td align='left'>${typhForecastInfo.stTime}</td></tr>
                          <tr><td align='left'>预报时间：</td><td align='left'>${typhForecastInfo.location}</td></tr>
                          <tr><td align='left'>中心位置：</td><td align='left'>${typhForecastInfo.lng}°E, ${typhForecastInfo.lat}°N</td></tr>
                          <tr><td align='left'>风速：</td><td align='left'>${typhForecastInfo.speed} 米/秒</td></tr>
                          <tr><td align='left'>中心压强：</td><td align='left'>${typhForecastInfo.presure} hpa</td></tr>
                          <tr><td align='left'>强度：</td><td align='left'>${strength_CNName}(${typhForecastStre})</td></tr>
                          <tr><td align='left'>预报单位：</td><td align='left'>${colorTyphForecast[typhForecastType].CN_Name}</td></tr>
                        </table>
                    `.trim();
                    }

                    this.content.innerHTML = html;
                    this.overlay.setPosition(feature.getGeometry().getCoordinates());
                }
            },
            /**
             * 近海海域 预报 popup
             */
            seaAreaForecastPopup(feature, pixel) {
                //如果移动到新的feature，修改feature样式
                if (this.lastPointerFeature !== feature) { //鼠标移动到了新的feature
                    let featureStyle = feature.getStyle();  //记录本次feature的样式
                    if (this.lastPointerFeature != null) {  //如果上次feature不为空，将值设置为上一feature的样式
                        this.lastPointerFeature.setStyle(featureStyle);
                    }
                    let highlightStyle = new Style({  //鼠标覆盖，创建新的feature样式
                        stroke: new Stroke({
                            color: '#3681AA',
                            width: 2
                        }),
                        fill: new Fill({
                            color: 'rgba(54, 129, 170, 1)'
                        }),
                    });
                    feature.setStyle(highlightStyle);
                    // this.seaAreaForecastPopup(feature, pixel); //显示弹框
                }
                var seaAreInfo = feature.get('feature_data');
                //构建Popup_title文字内容
                this.ol_popup_min_width = "270px";
                this.popup_title = seaAreInfo.hqbh + ":" + seaAreInfo.hqmc;

                if (seaAreInfo != null) {
                    //组织弹出框内容
                    var html = `
                        <table>
                          <tr><td align='left'>天气情况：</td><td align='left'>${seaAreInfo.tqqk}</td></tr>
                          <tr><td align='left'>风向：</td><td align='left'>${seaAreInfo.fx}</td></tr>
                          <tr><td align='left'>风速(级)：</td><td align='left'>${seaAreInfo.fs} </td></tr>
                          <tr><td align='left'>视程范围(公里)：</td><td align='left'>${seaAreInfo.scfw}</td></tr>
                          <tr><td align='left'>风浪(米)：</td><td align='left'>${seaAreInfo.fl} </td></tr>
                          <tr><td align='left'>涌浪(米)：</td><td align='left'>${seaAreInfo.yl} </td></tr>
                        </table>
                    `.trim();
                    this.content.innerHTML = html;
                    this.overlay.setPosition(this.map.getCoordinateFromPixel(pixel));
                }
                this.lastPointerFeature = feature; //记录本次feature
            },
            /**
             * 执法海域 预报 popup
             */
            lawAreaPolygonPopup(feature, pixel) {
                //如果移动到新的feature，修改feature样式
                if (this.lastPointerFeature !== feature) { //鼠标移动到了新的feature
                    if (this.lastPointerFeature != null) {
                        let oldColor = this.lastPointerFeature.getStyle().getFill().getColor();
                        oldColor[3] = 0.4;
                        this.lastPointerFeature.getStyle().getFill().setColor(oldColor);
                    }

                    let rgba = feature.getStyle().getFill().getColor();
                    rgba[3] = 1;
                    feature.getStyle().getFill().setColor(rgba);

                    this.law_area_layer.getSource().changed();
                    this.lastPointerFeature = feature; //记录本次feature
                }

                this.ol_popup_min_width = "100px";
                this.popup_title = feature.get('areaName');
                this.content.innerHTML = "";
                this.overlay.setPosition(this.map.getCoordinateFromPixel(pixel));
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
            typhChinaForecastDraw(countryLayer) {
                if (this.typh_forecast_feature == null) return;
                countryLayer.getSource().clear();

                let typhRouteInfo = this.typh_forecast_feature.get('data');
                let typhNum = typhRouteInfo.typhNum;
                let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
                let typhTime = typhRouteInfo.routeTime;
                let cenX = typhRouteInfo.lon;
                let cenY = typhRouteInfo.lat;

                // function drawChinaJapan()
                this.$axios
                    .get(`/api/SCSServices/getTyphForecastChinaJapan.action`, {
                        params: {
                            typhNum: typhNum,
                            staTime: typhTime
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        let data = res.data;
                        let lastPoint = fromLonLat([cenX, cenY]);

                        for (let i = 0; i < data.length; i++) {
                            let type = 'China';
                            let nowPoint = fromLonLat([data[i]['lon'], data[i]['lat']]);

                            this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, data[i]['strength'], countryLayer);
                            lastPoint = nowPoint;
                        }
                    })
                    .catch((res) => {
                        this.$confirm('服务器失联！typhForecastDraw drawChinaJapan ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    });
            },
            typhUSAEuropeForecastDraw(countryLayer) {
                if (this.typh_forecast_feature == null) return;
                countryLayer.getSource().clear();

                let typhRouteInfo = this.typh_forecast_feature.get('data');
                let typhNum = typhRouteInfo.typhNum;
                let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
                let typhTime = typhRouteInfo.routeTime;
                let cenX = typhRouteInfo.lon;
                let cenY = typhRouteInfo.lat;

                // function drawUSAEurope() USA
                this.$axios
                    .get(`/api/SCSServices/getTyphForecastUSAEurope.action`, {
                        params: {
                            typhNum: typhModelNum,
                            staTime: typhTime,
                            modelType: 'ENS'
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        let data = res.data;
                        let lastPoint = fromLonLat([cenX, cenY]);

                        for (let i = 0; i < data.length; i++) {
                            let type = 'USA';
                            let strength = this.calStrengthBySpeed(data[i]['speed']);
                            let nowPoint = fromLonLat([data[i]['lng'], data[i]['lat']]);

                            this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, strength, countryLayer);
                            lastPoint = nowPoint;
                        }
                    })
                    .catch((res) => {
                        this.$confirm('服务器失联！typhForecastDraw drawUSAEurope USA ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    });
            },
            typhEuropeForecastDraw(countryLayer) {
                if (this.typh_forecast_feature == null) return;
                countryLayer.getSource().clear();

                let typhRouteInfo = this.typh_forecast_feature.get('data');
                let typhNum = typhRouteInfo.typhNum;
                let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
                let typhTime = typhRouteInfo.routeTime;
                let cenX = typhRouteInfo.lon;
                let cenY = typhRouteInfo.lat;

                // function drawUSAEurope() Europe
                this.$axios
                    .get(`/api/SCSServices/getTyphForecastUSAEurope.action`, {
                        params: {
                            typhNum: typhModelNum,
                            staTime: typhTime,
                            modelType: 'EENS'
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        let data = res.data;
                        let lastPoint = fromLonLat([cenX, cenY]);

                        for (let i = 0; i < data.length; i++) {
                            let type = 'Europe';
                            let strength = this.calStrengthBySpeed(data[i]['speed']);
                            let nowPoint = fromLonLat([data[i]['lng'], data[i]['lat']]);

                            this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, strength, countryLayer);
                            lastPoint = nowPoint;
                        }
                    })
                    .catch((res) => {
                        this.$confirm('服务器失联！typhForecastDraw drawUSAEurope Europe ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    });
            },
            typhTEPOForecastDraw(countryLayer) {
                if (this.typh_forecast_feature == null) return;
                countryLayer.getSource().clear();

                let typhRouteInfo = this.typh_forecast_feature.get('data');
                let typhNum = typhRouteInfo.typhNum;
                let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
                let typhTime = typhRouteInfo.routeTime;
                let cenX = typhRouteInfo.lon;
                let cenY = typhRouteInfo.lat;

                // function drawTEPO()
                this.$axios
                    .get(`/api/SCSServices/getTyphForecastTEPO.action`, {
                        params: {
                            typhNum: typhModelNum,
                            staTime: typhTime
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        let data = res.data;
                        let lastPoint = fromLonLat([cenX, cenY]);

                        for (let i = 0; i < data.length; i++) {
                            let type = 'TEPO';
                            let strength = this.calStrengthBySpeed(data[i]['speed']);
                            let nowPoint = fromLonLat([data[i]['lng'], data[i]['lat']]);

                            this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, strength, countryLayer);
                            lastPoint = nowPoint;
                        }
                    })
                    .catch((res) => {
                        this.$confirm('服务器失联！typhForecastDraw drawUSAEurope TEPO ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    });
            },
            typhForecastDraw(typhRouteInfo, ModelNum) {
                // this.typh_forecast_layer.getSource().clear();
                // let typhNum = typhRouteInfo.typhNum;
                // let typhModelNum = ModelNum;
                // let typhTime = typhRouteInfo.routeTime;
                // let cenX = typhRouteInfo.lon;
                // let cenY = typhRouteInfo.lat;

                // function drawChinaJapan()
                this.typhChinaForecastDraw(this.typh_China_layer);

                // function drawUSAEurope() USA
                this.typhUSAEuropeForecastDraw(this.typh_USA_layer);

                // function drawUSAEurope() Europe
                this.typhEuropeForecastDraw(this.typh_Europe_layer);

                // function drawTEPO()
                this.typhTEPOForecastDraw(this.typh_TEPO_layer);

            },
            drawTyphForecastFeature(dataVal, type, lastPoint, nowPoint, strength, countryLayer) {
                let colorTyphStrength = mapLayout.colorTyphStrength;
                let colorTyphForecast = mapLayout.colorTyphForecast;

                // 绘制点
                let pointFeature = new Feature(new Point(nowPoint));
                pointFeature.set('name', 'typhForecastPointFeature');
                pointFeature.set('data', dataVal);
                pointFeature.set('type', type);
                pointFeature.set('strength', strength);
                pointFeature.setStyle(new Style({
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({
                            color: colorTyphStrength[strength].color
                        })
                    })
                }));

                // 预报轨迹线的绘制
                var lineFeature = new Feature(
                    new LineString([lastPoint, nowPoint,])
                );
                lineFeature.set('name', "typhLineFeature");
                lineFeature.setStyle(new Stystyle({
                        stroke: new Stroke({
                            lineDash: [1, 2, 3, 4, 5, 6],
                            width: 2,
                            color: colorTyphForecast[type].color,
                        }),
                    })
                );

                countryLayer.getSource().addFeature(lineFeature);
                countryLayer.getSource().addFeature(pointFeature);
            },
            calStrengthBySpeed(speed) {
                // 风速 强度 对应表
                // 热带气旋底层中心附近最大平均风速
                // 达到10.8m/s~17.1m/s（风力6~7级）为 热带低压，
                // 达到17.2 m/s ~24.4 m/s（风力8~9级）为 热带风暴，
                // 达到24.5 m/s ~32.6 m/s（风力10~11级）为 强热带风暴，
                // 达到32.7 m/s ~41.4 m/s（风力12~13级）为 台风，
                // 达到41.5 m/s ~50.9 m/s（风力14~15级）为 强台风，
                // 达到或大于51.0 m/s（风力16级或以上）为 超强台风。
                if (speed <= 17.1) {
                    return 'TD';
                } else if (speed <= 24.4) {
                    return 'TS';
                } else if (speed <= 32.6) {
                    return 'STS';
                } else if (speed <= 41.4) {
                    return 'TY';
                } else if (speed <= 50.9) {
                    return 'STY';
                } else {
                    return 'SUPERTY';
                }
            },

            /**
             * 绘制台风路径
             */
            typhRouteDrawLinePoint() {
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

                    // 视野移动
                    var center = [(coordinates[0][0] + coordinates[len - 1][0]) / 2, (coordinates[0][1] + coordinates[len - 1][1]) / 2];
                    var distance = Math.sqrt(Math.pow(lonlat[0][0] - lonlat[len - 1][0], 2) + Math.pow(lonlat[0][1] - lonlat[len - 1][1], 2));
                    // this.moveViewTo(center[0], center[1], distance);
                    this.moveViewTo(center[0], center[1]);

                    // 获得model编号和台风名称
                    let typhNum = val[0]['typhNum'];
                    let typhModelNum = null;
                    let typhName = null;
                    this.$axios
                        .get(`/api/SCSServices/queryTyphoonInfo.action?typhNum=${typhNum}`, {
                            params: {}
                        })
                        .then((res) => {
                            if (res.data != null) {
                                typhModelNum = res.data['modelNum'];
                                typhName = res.data['enName'];
                                this.typhRouteDraw(that, val, typhModelNum, typhName);
                            }
                        })
                        .catch((res) => {
                            this.$confirm('服务器失联！typhRoute ', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            })
                        });

                });
            },
            typhRouteDraw(that, val, typhModelNum, typhName) {
                // 初始点-------------------------------------------------------------------------------------------
                var iconStyle = new Style({
                    image: new Icon({
                        src: this.typh_img,
                        color: '#FFFFFF',
                        scale: 0.15,
                        opacity: 0.9,
                        rotation: 0,
                    })
                });
                var moveFeature = new Feature(new Point(fromLonLat([val[0]['lon'], val[0]['lat']])));
                moveFeature.setStyle(iconStyle);
                moveFeature.set('name', "typrMoveFeature");
                that.typh_move_layer.getSource().addFeature(moveFeature);

                // 第一个点
                var pointGeom = new Point(fromLonLat([val[0]['lon'], val[0]['lat']]));
                var pointFeature = new Feature(pointGeom);
                pointFeature.set('name', "typhPointFeature");
                pointFeature.set('data', val[0]);
                pointFeature.set('typhName', typhName);
                pointFeature.set('typhModelNum', typhModelNum);
                pointFeature.setStyle(new Style({
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({
                            color: mapLayout.colorTyphStrength[pointFeature.get('data')['strength']].color
                        })
                    }),
                    text: new Text({
                        text: typhName,
                        font: '15px Microsoft YaHei',
                        fill: new Fill({color: '#000000'}),
                        stroke: new Stroke({color: '#ffcc33', width: 12}),
                        placement: 'point',
                        textAlign: "center",
                        offsetX: 0,
                        offsetY: 30
                    }),
                }));
                that.typh_layer.getSource().addFeature(pointFeature);
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

                        // 清除定时器
                        clearInterval(that.typh_move_setTime);

                        // 绘制最后一个点的预报
                        that.typh_forecast_feature = that.typh_move_layer.getSource().getFeatures()[0];
                        that.typhForecastDraw(that.typh_move_layer.getSource().getFeatures()[0].get("data"), typhModelNum);
                        return;
                    }

                    // 台风移动点绘制
                    that.typh_move_layer.getSource().clear();
                    var moveFeature = new Feature(new Point(fromLonLat([val[index]['lon'], val[index]['lat']])));
                    moveFeature.set('name', 'typhMoveFeature');
                    moveFeature.set("data", val[index]);
                    moveFeature.set('typhModelNum', typhModelNum);
                    moveFeature.setStyle(iconStyle);
                    that.typh_move_layer.getSource().addFeature(moveFeature);

                    // 台风点等级的渲染
                    var pointFeature = new Feature(
                        new Point(fromLonLat([val[index]['lon'], val[index]['lat']]))
                    );
                    pointFeature.set("name", "typhPointFeature");
                    pointFeature.set("data", val[index]);
                    pointFeature.set('typhName', typhName);
                    pointFeature.set('typhModelNum', typhModelNum);
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
                        })
                    );
                    that.typh_route_layer.getSource().addFeature(lineFeature);

                    index += 1;
                    that.typh_move_setTime = setTimeout(drawTyph, 100);
                }

                // 动画化绘制路线
                drawTyph();
            },


            //  *****************************seaArea 近海预报  start******************************************
            seaAreaList2Polygon(ptArr) {
                let areaPolygonPts = new Array();
                let areaPolygon = new Array();
                for (let i = 0; i < ptArr.length; i++) {
                    let temp = [ptArr[i].x, ptArr[i].y];
                    areaPolygon.push(temp);
                }
                areaPolygonPts.push(areaPolygon);
                return areaPolygonPts;
            },
            seaAreaCreatePolygonFeature: function (points, name, id, forecastData) {
                var polygonFeature = new Feature({
                    geometry: new Polygon(points),
                    name: 'seaArea',
                })
                polygonFeature.set('feature_id', id)
                polygonFeature.set('feature_data', forecastData)
                return polygonFeature
            },
            seaAreaCreateVectorLayer: function (vectorSource_seaArea) {
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
            seaAreaDrawPolygon() {
                globalBus.$on('drawSeaArea', (areaList, areaForecastData) => {
                    this.moveViewTo(fromLonLat([120, 23])[0], fromLonLat([120, 23])[1], 4.5);

                    let vectorSource_seaArea = new VectorSource();
                    // 海区列表 和 预报数据 是对应的
                    for (let i = 0; i < areaList.length; i++) {
                        // 转换polygon
                        let polygons = this.seaAreaList2Polygon(areaList[i].pt);
                        // 创建feature，加入要显示的预报数据(第一个数据)
                        if (areaList[i].area == areaForecastData[i].data[0].hqbh) { //判断海区是否一致，根据编号
                            this.sea_area_layer.getSource().addFeature(this.seaAreaCreatePolygonFeature(polygons, areaList[i].alias, areaList[i].area, areaForecastData[i].data[0]));
                        } else { //如果位置不对应，遍历 areaForecastData，寻找对应预报数据
                            for (let j = 0; j < areaForecastData.length; j++) {
                                if (areaForecastData[j].data[0].hqbh == areaList[i].area) {
                                    this.sea_area_layer.getSource().addFeature(this.seaAreaCreatePolygonFeature(polygons, areaList[i].alias, areaList[i].area, areaForecastData[i].data[0]));
                                }
                            }
                        }
                    }
                    // let seaAreVectorLayer = this.seaAreaCreateVectorLayer(vectorSource_seaArea);
                    // this.map.addLayer(seaAreVectorLayer);
                })
            },
            //  *****************************seaArea 近海预报   end******************************************


            //  ***************************** lawArea 执法海域预报   start ******************************************
            createLawAreaPolygon(json) {
                let areaName = json.area;
                let color = json.color;
                let labx = parseFloat(json.labx);
                let laby = parseFloat(json.laby);
                let points = [];
                json.pt.forEach(function (xys) {
                    points.push([parseFloat(xys.x), parseFloat(xys.y)]);
                });
                points.push([parseFloat(json.pt[0].x), parseFloat(json.pt[0].y)])

                let lawAreaFeature = new Feature({
                    geometry: new Polygon([points]),
                    name: 'lawAreaPolygonFeature',
                    areaName: areaName
                });

                // 设置样式
                let rgba = asArray(color).slice();
                rgba[3] = 0.4;
                lawAreaFeature.setStyle(new Style({
                    fill: new Fill({
                        color: rgba,
                    }),
                    text: new Text({
                        text: areaName,
                        textAlign: "center",
                        textBaseline: "middle",
                        placement: "point", //point 则自动计算面的中心k点然后标注  line 则根据面要素的边进行标注
                        // overflow: true //超出面的部分不显示
                    }),
                }));

                this.law_area_layer.getSource().addFeature(lawAreaFeature);
            },
            // 绘制执法海域 Polygon
            lawAreaDrawPolygon() {
                globalBus.$on('lawAreaDraw', (lawAreaJson) => {
                    this.moveViewTo(fromLonLat([120, 17])[0], fromLonLat([120, 17])[1], 5);

                    // 判断是否已经加入了执法海域要素，如果没有加入则继续执行
                    let lawAreaSourceFeatures = this.law_area_layer.getSource().getFeatures();
                    if (lawAreaSourceFeatures.length > 0) return;

                    for (let i = 0; i < lawAreaJson.length; i++) {
                        this.createLawAreaPolygon(lawAreaJson[i]);
                    }
                });
            },
            //  ***************************** lawArea 执法海域预报   end ********************************************


            //  *****************************GlobalNumerical 全球区域   start******************************************

            // 绘制矩形
            drawRectangelGlobalNumerical() {
                globalBus.$on('drawRectangle', (flag) => {
                    if (flag) {
                        this.globalNum_draw_layer.getSource().clear()
                        this.map.removeLayer(this.globalNum_draw_layer)
                        this.map.removeInteraction(this.globalNum_draw)
                        let pngUrl = this.globalNum_current_png.pngUrl
                        var globalNumThis = this
                        this.globalNum_draw.on('drawend', function (e) {
                            const geometry = e.feature.getGeometry()
                            const corrdinates = geometry.getCoordinates()
                            // [0][0]是左下角 [0][1]右下 [0][2]右上 [0][3]左上
                            let leftBottom = transform(corrdinates[0][0], "EPSG:3857", "EPSG:4326")
                            let rightTop = transform(corrdinates[0][2], "EPSG:3857", "EPSG:4326")
                            // this.globalNum_visible_extent = [leftBottom[0],leftBottom[1],rightTop[0],rightTop[1]]
                            globalNumThis.globalNum_visible_extent = [corrdinates[0][0][0], corrdinates[0][0][1], corrdinates[0][2][0], corrdinates[0][2][1]];
                            globalNumThis.addPngImageGlobalNumerical(pngUrl, globalNumThis.globalNum_visible_extent);

                            globalBus.$emit('fillGlobalNumLonlatInput', leftBottom, rightTop)
                            globalNumThis.map.removeInteraction(globalNumThis.globalNum_draw)
                        })
                        this.map.addLayer(this.globalNum_draw_layer)
                        this.map.addInteraction(this.globalNum_draw)
                    } else {
                        this.globalNum_draw_layer.getSource().clear()
                        this.map.removeLayer(this.globalNum_draw_layer)
                        this.map.removeInteraction(this.globalNum_draw)
                    }

                });
            },
            addPngImageGlobalNumerical(pngUrl, viewExtent) {

                this.map.removeLayer(this.globalNum_left_imgLayer)
                this.map.removeLayer(this.globalNum_right_imgLayer)
                let mapExtent = this.map.getView().getProjection().getExtent()
                var projection = new Projection({
                    code: 'EPSG:3857',
                    extent: mapExtent,
                });
                let rightSide1 = fromLonLat([0, -85]);
                let rightSide2 = fromLonLat([360, 85]);
                let rightSideExtent = [rightSide1[0], rightSide1[1], rightSide2[0], rightSide2[1]];
                let rightSidePng = new ImageStaticSource({
                    url: pngUrl,
                    projection: projection,
                    imageExtent: rightSideExtent,
                    crossOrigin: '',
                });
                let x1 = fromLonLat([-19.67, -17.91]);
                let x2 = fromLonLat([29.02, 3.93]);  //左下角 右上角  成功
                let layerExtent = [x1[0], x1[1], x2[0], x2[1]];
                this.globalNum_right_imgLayer = new ImageLayer({
                    source: rightSidePng,
                    extent: viewExtent  //只渲染部分，成功！
                });
                this.globalNum_right_imgLayer.setOpacity(0.8)
                this.map.addLayer(this.globalNum_right_imgLayer);


                let leftSide1 = fromLonLat([-360, -85]); //
                let leftSide2 = fromLonLat([0, 85]);
                let leftSideExtent = [leftSide1[0], leftSide1[1], leftSide2[0], leftSide2[1]];

                let leftSidePng = new ImageStaticSource({
                    url: pngUrl,
                    projection: projection,
                    imageExtent: leftSideExtent,
                    crossOrigin: '',
                });
                this.globalNum_left_imgLayer = new ImageLayer({
                    source: leftSidePng,
                    extent: viewExtent  //只渲染部分，成功！

                });
                this.globalNum_left_imgLayer.setOpacity(0.8)
                this.map.addLayer(this.globalNum_left_imgLayer);
            },
            globalNumericalZoomChange(viewExtent) {
                let currentZoom = parseInt(this.map.getView().getZoom())
                let newPngUrl = '';
                if (this.globalNum_current_png.type == '3') {
                    if (currentZoom >= 2 && currentZoom <= 4) {
                        newPngUrl = this.globalNum_current_png.pngUrl.replace('.png', '_D0.png')
                    } else if (currentZoom >= 5 && currentZoom <= 8) {
                        newPngUrl = this.globalNum_current_png.pngUrl.replace('.png', '_D5.png')
                    }
                } else if (this.globalNum_current_png.type == '4') {
                    if (currentZoom >= 2 && currentZoom <= 3) {
                        newPngUrl = this.globalNum_current_png.pngUrl.replace('.png', '_D0.png')
                    } else if (currentZoom >= 4 && currentZoom <= 5) {
                        newPngUrl = this.globalNum_current_png.pngUrl.replace('.png', '_D5.png')
                    } else if (currentZoom >= 6 && currentZoom <= 8) {
                        newPngUrl = this.globalNum_current_png.pngUrl.replace('.png', '_D6.png')
                    }
                } else {
                    return;
                }
                if (this.globalNum_current_png.pngUrl == newPngUrl)
                    return
                this.addPngImageGlobalNumerical(newPngUrl, viewExtent);
            },
            globalNumericalAddImage() {
                globalBus.$on('addPngImageGlobalNum', (pngUrl, globalNumType, viewExtent) => {
                    /**
                     *  globalNumType
                     *   1 === 气象图
                     *   2 === 风浪图
                     *   3 === 气象格点图    分为 D5（Zoom 2-4） 和 D0( zoom 5-8 ) 两种
                     *   4 === 风浪格点图    分为 D6（Zoom 2-3） 和 D5( zoom 4-5 ) 和 D0( zoom 6-8 ) 三种
                     * */
                    let leftBottom = transform([viewExtent[0], viewExtent[1]], "EPSG:4326", "EPSG:3857")
                    let rightTop = transform([viewExtent[2], viewExtent[3]], "EPSG:4326", "EPSG:3857")
                    this.globalNum_visible_extent = [leftBottom[0], leftBottom[1], rightTop[0], rightTop[1]]
                    switch (globalNumType) {
                        case '1':  //风浪-10米风场
                            this.globalNum_current_png.type = '1'
                            this.globalNum_current_png.pngUrl = pngUrl
                            this.addPngImageGlobalNumerical(pngUrl, this.globalNum_visible_extent);
                            break;
                        case '2':  //风浪-海浪
                            this.globalNum_current_png.type = '2'
                            this.globalNum_current_png.pngUrl = pngUrl
                            this.addPngImageGlobalNumerical(pngUrl, this.globalNum_visible_extent);
                            break;
                        case '3':  //格点-10米风场 根据当前zoom变换不同图片
                            this.globalNum_current_png.type = '3'
                            this.globalNum_current_png.pngUrl = pngUrl
                            this.globalNumericalZoomChange(this.globalNum_visible_extent)
                            break;
                        case '4':  //格点-波高
                            this.globalNum_current_png.type = '4'
                            this.globalNum_current_png.pngUrl = pngUrl
                            this.globalNumericalZoomChange(this.globalNum_visible_extent)
                            break;
                    }

                    /*return
                    let mapProjection = this.map.getView().getProjection()
                    let mapExtent = this.map.getView().getProjection().getExtent()
                    let lonLat =  [0,90,360,90];
                    let rightSide1 = fromLonLat([0,-85]);
                    let rightSide2 = fromLonLat([360,85]);
                    var rightSideExtent = [rightSide1[0], rightSide1[1], rightSide2[0], rightSide2[1]];
                    var projection = new Projection({
                      code: 'EPSG:3857',
                      extent: mapExtent,
                    });
                    var imageExtent = [0,
                                    -20037508.342789244,
                                    20037508.342789244*2,
                                    20037508.342789244];
                    this.globalNum_imgLayer = new ImageLayer({
                      source: new ImageStaticSource({
                        url: pngUrl,
                        projection: projection,
                        imageExtent: rightSideExtent,
                        crossOrigin: '',
                      }),
                    });
                    console.log(this.globalNum_imgLayer)
                    this.globalNum_imgLayer.setOpacity(0.6)
                    this.map.addLayer(this.globalNum_imgLayer);
                    let leftSide1 = fromLonLat([-360,-85]);
                    let leftSide2 = fromLonLat([0,85]);
                    var leftSideExtent = [leftSide1[0], leftSide1[1], leftSide2[0], leftSide2[1]];
                    this.globalNum_imgLayer = new ImageLayer({
                      source: new ImageStaticSource({
                        url: pngUrl,
                        projection: projection,
                        imageExtent: leftSideExtent,
                        crossOrigin: '',
                      }),
                    });
                    this.globalNum_imgLayer.setOpacity(0.6)
                    this.map.addLayer(this.globalNum_imgLayer);*/

                })
            },
            //  *****************************GlobalNumerical 全球区域   end******************************************

        },

        mounted: function () {
            this.mapInit();
            this.typhRouteDrawLinePoint();
            this.seaAreaDrawPolygon();
            this.lawAreaDrawPolygon();
            this.clearMapLawAreaLayer();
            this.globalNumericalAddImage();
            this.drawRectangelGlobalNumerical();

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
