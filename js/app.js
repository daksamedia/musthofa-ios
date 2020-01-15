// Dom7
var $$ = Dom7;

// Theme
var theme = 'md';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
};

// Init App
var app = new Framework7({
  id: 'com.musthofalapor.app',
  root: '#app',
  theme: theme,
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  popup: {
    closeOnEscape: true,
  },
  sheet: {
    closeOnEscape: true,
  },
  dialog: {
    title: 'Musthofa Lapor Rakyat',
    buttonOk: 'Ya',
    buttonCancel:'Tutup'
  },
  popover: {
    closeOnEscape: true,
  },
  actions: {
    closeOnEscape: true,
  },
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
  statusbar: {
    iosOverlaysWebView: false,
  },
  lazy: {
    placeholder:'img/empty.png',
    sequential:true
  },
  on:{
    init(){
        //var slide_berita;
        
        if(localStorage.login_status!=undefined || localStorage.getItem("login_status")!=null || localStorage.hasOwnProperty('login_status')){
          if(localStorage.login_status==="false" || localStorage.login_status===""){
            $$(".login-mode").remove();
          }else{
            if(localStorage.login_avatar==undefined || localStorage.login_avatar=="#" || localStorage.login_avatar=="0"){
              $$(".my_img").attr("src","https://www.iavm.org/sites/default/files/iavm/staff/blank_avatar.jpg");
            }else{
              $$(".my_img").attr("src",localStorage.login_avatar);
            }
            $$(".my_name").html(localStorage.login_fullname);
            $$(".guest-mode").remove();
          };
        }else{
          $$(".login-mode").remove();
          localStorage.login_status="false"
        }

    }
  }
});

// back button
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown(){
  var app_url = app.views.main.router.url;
  if(app_url=="/"){
    app.dialog.confirm("Anda ingin tutup aplikasi?","Tutup aplikasi",function(){
      navigator.app.exitApp();
    });
  }else{
    if(news_opened==true){
      app.card.close()
    }else{
      app.views.main.router.back();
    }
    
  }
}

var onesignal_id=0;

// init on device ready
document.addEventListener('deviceready', function () {
  // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("b7598d75-6d58-4b3e-a438-c09f2f18e784")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();


    window.plugins.OneSignal.getIds(function(ids) {
        //alert("player id: " + ids.userId);
        onesignal_id = ids.userId
    });
}, false);

// vars
var main = app.views.main;
var login_status = localStorage.login_status;
var login_name = localStorage.login_fullname;
var login_avatar = localStorage.login_avatar;
var asp_loaded = false;
var news_opened = false;
var empty_graph = "img/empty.png";
var empty_msg = "Konten belum tersedia.";
var my_id = localStorage.login_id;
var aspirasi_title = "";
var aspirasi_site = "https://musthofa-dev.netlify.com/"
var month_arr = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

// others
$$(".news-slider").click(function(){
  main.router.navigate("/berita/");
});

$$(".logout").click(logout);

// all functions
function logout(){
  app.dialog.confirm("Anda yakin mau keluar akun?","Keluar Akun", function(){
    firebase.auth().signOut().then(function() {
      localStorage.login_status = "false";
      localStorage.login_fullname = "#";
      localStorage.login_avatar = "#";
      localStorage.login_id = "0";
      window.location.reload();
    }).catch(function(error) {
      console.log(error);
    });
  });
}

function get_currect_user(){
  db.ref("users/"+my_id).on("value", function (snapshot) {
    console.log(snapshot.val());
    //snapshot.forEach(function(childSnapshot) {
      var dataUser = snapshot.val();
      console.log(dataUser);
      localStorage.setItem("login_fullname", dataUser.fullname);
      localStorage.setItem("login_avatar", dataUser.avatar);
      localStorage.setItem("login_id", dataUser.id);
      localStorage.setItem("login_email",dataUser.email);
      if(localStorage.login_avatar==undefined || localStorage.login_avatar=="#" || localStorage.login_avatar=="0" ){
        $$(".my_img").attr("src","https://www.iavm.org/sites/default/files/iavm/staff/blank_avatar.jpg");
      }else{
        $$(".my_img").attr("src",localStorage.login_avatar);
      }
      $$(".my_name").html(localStorage.login_fullname);
    //});
  });
  
}