// global variables
window.g = {
  width: 320,
  height: 480,
  couchLocation: 'http://yomobi.couchone.com',
  db_name: 'chipotle',
  username: 'admin_chipotle',
  password: '123123',
  appData: {
    company: "chipotle"
  }
};
window.widgetClasses = {};

_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

// wdata = [
//   {
//     name:  "full-website",
//     wtype: "link",
//     url:   "http://www.google.com"
//   },
//   {
//     name: "about-us",
//     wtype: "custom_page",
//     content: "<h1>About Us</h1><p>This is our mobile website. Lorem ipsum dolor sit amet, "+
//              "consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et "+
//              "dolore magna aliqua.</p><p>Ut enim ad minim veniam, quis nostrud exercitation "+
//              "ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor "+
//              "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>"
//   }
// ];

bdata = {
  "full-website": {
    helpText: "Add a link from your YoMobi mobile website to your full website",
    editAreaTemplate: util.getTemplate('full-website-edit-area')
  },
  
  "about-us": {
    helpText: "A page describing what your business is about.",
    editAreaTemplate: util.getTemplate('about-us-edit-area')
  }
}
