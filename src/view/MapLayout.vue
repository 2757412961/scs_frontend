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
  import ZoomSlider from 'ol/control/ZoomSlider'
  import ZoomToExtent from 'ol/control/ZoomToExtent'
  import 'ol/ol.css';
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import Polygon from 'ol/geom/Polygon'
  import Polyline from 'ol/format/Polyline';
  import VectorSource from 'ol/source/Vector';
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


  import { globalBus } from '../components/globalBus';

  // .vue文件 单文件组件 component
  export default {
    name: "map-layout",
    components: {},
    data() {
      return {
        map:null,//地图
        typh_layer:null,//台风图层
        sea_area_layer:null,//近海海区图层
        zfhy_area_layer:null,//执法海域图层
        pro_layers:[],//数值预报产品图层
        lastPointerFeature: null,//记录上一次光标指向的feature

        //记录当前地图缩放层级
        oldZoom:0
      }
    },
    created() {

    },
    methods: {

      /**
       * 地图初始化
       */
      mapInit() {

        /** 地图图层初始化*/
        //"http://"+this.$store.state.serverIP+"/tianditu/tdt/{z}/{y}/{x}.jpg"
        //"http://"+this.$store.state.serverIP+"/FeatureWithLabelGZA/{z}/{x}/{y}.jpg"
        var map_source = new XYZ({
          url: "http://"+this.$store.state.serverIP+"/TerrainWithLabel/{z}/{x}/{y}.jpg"    //FeatureWithLabelGZA
        });
        var map_layer = new TileLayer({
          source: map_source
        });

        /** 视图初始化*/
        var view = new View({
          center: fromLonLat([113.8, 22.45]),
          zoom: 4,
          minZoom: 2,
          maxZoom: 9,
        });
        this.oldZoom=10;

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

        var ZoomSliderControl = new ZoomSlider();
        var ZoomExtentControl = new ZoomToExtent({
          extend: [13100000, 4290000,
            13200000, 5210000
          ]
        });
        /** Map初始化*/
        this.map = new Map({
          target: "scsmap",
          layers: [map_layer],
          view: view,
          controls:defaultControls().extend([mousePositionControl, ScaleControl, ZoomSliderControl, ZoomExtentControl]),
        });


        //鼠标移动事件绑定
        this.map.on('pointermove', this.mouseMove);
        //鼠标点击地图响应事件绑定
        this.map.on('singleclick',this.singleClickOnMap);
        //地图范围变化事件绑定
        this.map.on('moveend',this.zoomEvent)

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
        if(hit)
        {
          //获取当前的feature
          var features = this.map.getFeaturesAtPixel(pixel);
          // 获取feature的name（唯一标识）
          let featureName = features[0].get('name');
          switch (featureName) {
            case 'seaArea':      //近海预报 feature鼠标覆盖事件
              //如果移动到新的feature，修改feature样式
              if (this.lastPointerFeature !== features[0]){ //鼠标移动到了新的feature
                let featureStyle = features[0].getStyle();  //记录本次feature的样式
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
                features[0].setStyle(highlightStyle);
              }
              //显示feature信息
              let id_feature = features[0].get('feature_id');
              let forecastData = features[0].get('feature_data');

              this.lastPointerFeature = features[0]; //记录本次feature
              break;
          }
        }
        else
        {

        }

      },

      /**
       * 地图区域鼠标点击事件
       * @param e
       */
      singleClickOnMap(e){
        //如果点击处有feature则返回
        var pixel = e.pixel;//获取地图上坐标
        var lonlat = toLonLat(this.map.getCoordinateFromPixel(e.pixel));
        var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
        if(hit){
          return ;
        }
        else{

        }

      },

      /**
       * 判断地图是否缩放，
       * 若缩放，则判断是否有数据产品图层
       * 如果有，则更新数据产品层级
       * @param e
       */
      zoomEvent(e){
        //判断地图是否缩放,无缩放则返回
        var zoom = this.map.getView().getZoom();  //获取当前地图的缩放级别
        if(this.oldZoom==zoom)
          return;
        //若缩放，记录当前缩放层级
        this.oldZoom=zoom;

        //判断是否有数据产品图层，若无则返回
        //若有数据产品图层，则更新数据产品层级
      },

      typhRoute() {
        globalBus.$on('addTyphMonitor',(val, oldVal) => {
          console.log('I AM HERE!!!!');
          console.log(val);

          if(val[0]==null){
            return;
          }

          var coordinate = [];
          var coordinate1 = [];
          // alert('重复标志');

          for(var i =0; i<val.length;i++){
            coordinate.push(transform([val[i]['lon'],val[i]['lat']],'EPSG:4326','EPSG:3857'));
          }

          coordinate1.push(transform([val[0]['lon'],val[0]['lat']],'EPSG:4326','EPSG:3857'));
          var geometry = new LineString(coordinate1);

          //实例化一个矢量图层Vector作为绘制层
          var source = new VectorSource();

          var LineStringFeature = new Feature(geometry);

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


          // 需要删除原有图层或已有要素！！
          // vectorLayer.getSource().removeFeature(pop[1]);


          // 台风等级的渲染还没写
          // 鼠标移到台风和点击的事件还没写
          // 组件的收缩、下拉条有问题


          this.map.addLayer(vectorLayer);

          var pointGeom = new MultiPoint(coordinate1);
          var sourcepoint = new VectorSource();
          var pointFeature = new Feature(pointGeom);


          sourcepoint.addFeature(pointFeature);
          var pointLayer = new VectorLayer({
            source: sourcepoint,
            style:
              // function (feature, resolution) {
            //   var strength = feature.get("strength");
            //   var style = null;
            //   if (strength == " ") {
            //     style = new ol.style.Style({
            //       stroke: new ol.style.Stroke({
            //         color: "red",
            //         width: 3
            //       })
            //     });
            //   }
            //   else {
            //     style = new ol.style.Style({
            //       stroke: new ol.style.Stroke({
            //         color: "blue",
            //         width: 3
            //       })
            //     });
            //   }
            //   return [style]
            // }


              new Stystyle({
              image: new CircleStyle({
                radius: 2,
                fill: new Fill({
                  color: '#000'
                })
              })
            })
          });
          this.map.addLayer(pointLayer);
          // console.log(coordinate);

          // 最后一个标记点的坐标
          var index = 1;
          var interval = setInterval(function(){

            var newPoint = [coordinate[index][0], coordinate[index][1]];
            coordinate1.push(newPoint);
            geometry.setCoordinates(coordinate1);
            pointGeom.setCoordinates(coordinate1);

            index += 1;

          }, 30);

          setTimeout(function(){
            clearInterval(interval);
          }, 30*coordinate.length);

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

  #scsmap .ol-zoom-in.ol-has-tooltip:hover [role=tooltip],
  #scsmap .ol-zoom-in.ol-has-tooltip:focus [role=tooltip] {
    top: 3px;
  }

  #scsmap .ol-zoom-out.ol-has-tooltip:hover [role=tooltip],
  #scsmap .ol-zoom-out.ol-has-tooltip:focus [role=tooltip] {
    top: 232px;
  }


  /*设置缩放控件ZoomToExtent的样式，将其放到导航条下方
          */

  #scsmap .ol-zoom-extent {
    top: 265px;
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
