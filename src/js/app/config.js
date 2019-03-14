const mode = {
  DAY: 0,
  NIGHT: 1,
};

const family = {
  HELVETICA: 'Helvetica',
};

export default {
  mode,
  family,

  [mode.DAY]: {
    titleColor: {r: 0, g: 0, b: 0},
    chartNameColor: {r: 60, g: 60, b: 60},
    bgColor: {r: 255, g: 255, b: 255},
    tapAnimColor: {r: 228, g: 236, b: 244, a: 0.3},
    axisTextColor: {r: 152, g: 158, b: 163},
    axisLineColor: {r: 242, g: 244, b: 245, a: 1},

    button: {
      fill: {r: 255, g: 255, b: 255},
      stroke: {r: 230, g: 236, b: 240},
      text: {r: 0, g: 0, b: 0},
      anim: {r: 220, g: 220, b: 220, a: 1},
    },

    scrollBar: {
      frame: {r: 0, g: 0, b: 0, a: 0.06},
      overlay: {r: 255, g: 255, b: 255, a: 0.8},
      bg: {r: 255, g: 255, b: 255},
    },

    info: {
      boxFill: {r: 255, g: 255, b: 255},
      boxStroke: {r: 32, g: 32, b: 32, a: 0.1},
      textColor: {r: 60, g: 60, b: 60},
    },
  },

  [mode.NIGHT]: {
    titleColor: {r: 255, g: 255, b: 255},
    chartNameColor: {r: 255, g: 255, b: 255},
    bgColor: {r: 36, g: 47, b: 62},
    tapAnimColor: {r: 228, g: 236, b: 244, a: 0.1},
    axisTextColor: {r: 90, g: 106, b: 123},
    axisLineColor: {r: 19, g: 27, b: 35, a: 0.6},

    button: {
      fill: {r: 36, g: 47, b: 62},
      stroke: {r: 52, g: 70, b: 88},
      text: {r: 255, g: 255, b: 255},
      anim: {r: 220, g: 220, b: 220, a: 0.4},
    },

    scrollBar: {
      frame: {r: 255, g: 255, b: 255, a: 0.08},
      overlay: {r: 31, g: 42, b: 56, a: 0.8},
      bg: {r: 31, g: 42, b: 56},
    },

    info: {
      boxFill: {r: 37, g: 50, b: 65},
      boxStroke: {r: 32, g: 32, b: 32, a: 0.6},
      textColor: {r: 255, g: 255, b: 255},
    },
  },

  modeTextStyle: {size: 26, family: family.HELVETICA, fill: 'rgb(24,145,255)'},
  axisTextStyle: {size: 18, family: family.HELVETICA},
  buttonTextStyle: {size: 28, family: family.HELVETICA},

  title: 'Statistics',
  titleTextStyle: {weight: 'bold', size: 36, family: family.HELVETICA},

  chartNameStyle: {family: family.HELVETICA},

  months: ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut'],
};
