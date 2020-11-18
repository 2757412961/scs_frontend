import Login from '../view/Login'
import Home from '../view/Home'
import Typhoon from '../components/Typhoon/Typhoon'
import SeaArea from '../components/SeaArea/SeaArea'
import Observation from '../components/Observation/Observation'
import LawArea from '../components/LawArea/LawArea'
import PredictionPaper from '../components/PredictionPaper/PredictionPaper'
import RegionNumerical from '../components/NumericalPrediction/RegionNumerical'
import GlobalNumerical from '../components/NumericalPrediction/GlobalNumerical'

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录'
  },
  component: Login
};

export const moduleRouter = [
  {
    path: '/typhoon',
    name: 'typhoon',
    meta: {
      title: '台风警报',
      needGuard: true
    },
    component: Typhoon,
  }, {
    path: '/seaArea',
    name: 'seaArea',
    meta: {
      title: '近海海区',
      needGuard: true
    },
    component: SeaArea,
  }, {
    path: '/observation',
    name: 'observation',
    meta: {
      title: '观测实况',
      needGuard: true
    },
    component: Observation,
  }, {
    path: '/lawArea',
    name: 'lawArea',
    meta: {
      title: '执法海域',
      needGuard: true
    },
    component: LawArea,
  }, {
    path: '/predictionPaper',
    name: 'predictionPaper',
    meta: {
      title: '预报单',
      needGuard: true
    },
    component: PredictionPaper,
  }, {
    path: '/regionNumerical',
    name: 'regionNumerical',
    meta: {
      title: '数值预报—区域模式',
      needGuard: true
    },
    component: RegionNumerical,
  }, {
    path: '/globalNumerical',
    name: 'globalNumerical',
    meta: {
      title: '数值预报—全球模式',
      needGuard: true
    },
    component: GlobalNumerical,
  },

];

export const mainRouter = {
  path: '/home',
  name: 'home',
  meta: {
    title: 'Home',
    needGuard: true
  },
  component: Home,
  children: moduleRouter
};

export const routers = [
  loginRouter,
  mainRouter,
  // toolbarRouter,
  // catch all redirect
  {path: '*', redirect: '/typhoon'}

];
