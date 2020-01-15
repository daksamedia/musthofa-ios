var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
    stackPages:true,
    on:{
      pageInit:function(){
        get_currect_user();
        
        
        

        $$(".news-slider").html(`<div class="block" style="background:url(img/welcome.jpg) no-repeat center center;background-size:cover;display:flex;align-items:center;justify-content:center;height: 100%;color: white;font-weight: bold;margin: 0;font-size: 4vh;text-align: center;">Laporkan Segala Keluhan & Aspirasi Online </div>`).css("height","28vh");
      }
    }
  },
  // About page
  {
    path: '/about/',
    url: './pages/about.html',
    name: 'about',
    on:{
      pageInit:function(){
        var about_db = db.ref("static_content").child("about");
        about_db.on("value",function(snap){
          var about = snap.val();
          $$(".about-content").html(about.content)
        })
      }
    }
  },
  {
    path: '/semua-aspirasi/',
    url: './pages/semua-aspirasi.html',
    stackPages:true,
    on:{
      pageBeforeIn:function(){
        if(!asp_loaded){

          for(var i = 0;i < 4;i++){
            $$(".aspirasi_list").prepend(`<div class="card demo-facebook-card skeleton-text">
                <div class="card-header with-date" style="background:grey">
                    <div class="demo-facebook-avatar" style="background:#f4f4f4;"></div>
                    <div class="demo-facebook-name">Nama penulis</div>
                    <div class="demo-facebook-date">tanggal</div>
                </div>
                <div class="card-content card-content-padding">
                    <p>Judul aspirasi</p><img src="" width="100%" style="min-height:120px;" class="lazy lazy-fade-in demo-lazy" />
                    <p class="likes">Komentar : 0 orang </p>
                </div>
                <div class="card-footer"><a href="#" class="link" style="color:#da0724">kategori</a><a class="go_comment" data-title="" >Tanggapan</a><a class="link">Share</a></div>
            </div>`);
          }
          
        }
        
      },
      pageInit:function(){
        var aspx = db.ref("aspirasi/");
        var usrx = db.ref("users/");
        var asp_arr = []
         
        

        aspx.orderByChild("date_created").on("value", function(snapshot){
          //console.log(snapshot.exists());
          if(snapshot.exists()){
            var lazy_img = app.lazy.create("img.lazy");
            var asp_length = snapshot.numChildren()
            var aspirasi = snapshot.val();
            var aps_id = aspirasi.id;
            var asp_date = new Date(aspirasi.date_created).getDate();
            var asp_month = new Date(aspirasi.date_created).getMonth();
            var asp_year = new Date(aspirasi.date_created).getFullYear();
            var asp_hour = new Date(aspirasi.date_created).getHours();
            if(asp_hour<10){
              asp_hour="0"+asp_hour;
            }
            var asp_minute = new Date(aspirasi.date_created).getMinutes();
            if(asp_minute<10){
              asp_minute="0"+asp_minute;
            }
            
            var asp_all_date = asp_date +' '+month_arr[asp_month]+' '+asp_year+", "+ asp_hour +":"+ asp_minute;
            var asp_author_id = aspirasi.author.id;

         
            if(asp_length>0){
              asp_loaded = true;
              $$(".skeleton-text").remove();
              $$(".empty_state").remove();
              $$(".aspirasi_list").css("background","#fafafa").css("text-align","left");
              var asp_status = aspirasi.response.status;
  
              
              if(asp_status=="true"){
                $$(".aspirasi_list").prepend(`<div class="aspirasi-card card demo-facebook-card" data-author="`+ asp_author_id +`" data-created="`+ aspirasi.date_created +`">
                    <div class="card-header with-date">
                        <div class="demo-facebook-avatar"><img src="" width="34" height="34"/></div>
                        <div class="demo-facebook-name"></div>
                        <div class="demo-facebook-date">`+ asp_all_date +`</div>
                    </div>
                    <div class="card-content card-content-padding">
                        <p>`+ aspirasi.title +`</p><img src="`+ aspirasi.image +`" width="100%" style="min-height:120px;" class="lazy lazy-fade-in demo-lazy" />
                        <p class="likes">Komentar : `+ snapshot.child("comments").numChildren() +` orang &nbsp;<span style="float:right; color:#66ae67; font-weight:bold;">Sudah ditanggapi</span></p>
                    </div>
                    <div class="card-footer"><a href="#" class="link" style="color:#da0724">`+ aspirasi.category +`</a><a class="go_comment" data-title="`+ aspirasi.title +`" href="/komentar/`+ aps_id +`/" >Tanggapan</a><div class="link share" data-body="`+ aspirasi.title +`" data-title="Baca Aspirasi ini Sekarang" data-link="`+ aspirasi_site +`?id=`+ aps_id +`" data-author="" data-image="`+ aspirasi.image +`" >Share</div></div>
                </div>`);
                
                
              }else{
                $$(".aspirasi_list").prepend(`<div class="aspirasi-card card demo-facebook-card" data-author="`+ asp_author_id +`" data-created="`+ aspirasi.date_created +`">
                    <div class="card-header with-date">
                        <div class="demo-facebook-avatar"><img src="" width="34" height="34"/></div>
                        <div class="demo-facebook-name"></div>
                        <div class="demo-facebook-date">`+ asp_all_date +`</div>
                    </div>
                    <div class="card-content card-content-padding">
                        <p>`+ aspirasi.title +`</p><img src="`+ aspirasi.image +`" width="100%" style="min-height:120px;" class="lazy lazy-fade-in demo-lazy" />
                        <p class="likes">Komentar : `+ snapshot.child("comments").numChildren() +` orang &nbsp;</p>
                    </div>
                    <div class="card-footer"><a href="#" class="link" style="color:#da0724">`+ aspirasi.category +`</a><a class="go_comment" data-title="`+ aspirasi.title +`" href="/komentar/`+ aps_id +`/" >Tanggapan</a><div class="link share" data-body="`+ aspirasi.title +`" data-title="Baca Aspirasi ini Sekarang" data-link="`+ aspirasi_site +`?id=`+ aps_id +`" data-author="" data-image="`+ aspirasi.image +`" >Share</div></div>
                </div>`);
  
                
              }
  
              usrx.child(asp_author_id).on("value",function(snap){
                var author_name = snap.val().fullname;
                var author_avatar = snap.val().avatar;
                var author_id = snap.val().id;
                if(author_avatar==undefined || author_avatar=="#" || author_avatar=="0" ){
                  author_avatar= "https://www.iavm.org/sites/default/files/iavm/staff/blank_avatar.jpg"
                }
  
                $$(".aspirasi-card[data-author='"+ author_id +"']").find(".demo-facebook-name").html(author_name);
                $$(".aspirasi-card[data-author='"+ author_id +"']").find(".demo-facebook-avatar").find("img").attr("src",author_avatar);
                $$(".aspirasi-card[data-author='"+ author_id +"']").find(".share").data("author", author_name);
              });
              
  
              
              
            }else{
              $$(".aspirasi_list").html(`<div class="row empty_state" style="justify-content:center">
              <img src="`+ empty_graph +`" width="100%" style="opacity:.6" />
              <p>`+ empty_msg +`</p></div>`);
              $$(".aspirasi_list").css("background","white").css("text-align","center");
            }
          
          
            $$(".go_comment").click(function(){
              var this_title = $$(this).data("title");
              aspirasi_title = this_title;
            })
            
            $(".share").on('click',function(e){
              console.log("tot");
              e.preventDefault();
              e.stopImmediatePropagation();
              var author = $(this).data("author");
              var title = "Baca Aspirasi Ini dari"+ author;
              var body = $(this).data("body");
              var image = $(this).data("image");
              var link = $(this).data("link")
              window.plugins.socialsharing.share(body, title, image, link);
              
            });
          }else{
            asp_loaded=true;
            $$(".skeleton-text").remove();
            $$(".empty_state").remove();
            $$(".aspirasi_list").css("background","#fafafa").css("text-align","left");
            $$(".aspirasi_list").html(`<div class="row empty_state" style="justify-content:center">
            <img src="`+ empty_graph +`" width="100%" style="opacity:.6" />
            <p>`+ empty_msg +`</p></div>`);
            $$(".aspirasi_list").css("background","white").css("text-align","center");
          }
        })

        
      }
    }
  },
  {
    path:'/komentar/:id/',
    url:'./pages/komentar.html',
    options: {
      transition: 'f7-cover-v',
    },
    on:{
      pageBeforeIn:function(page){
        //console.log(page.detail.route.params.id);
        var asp_id = page.detail.route.params.id
        var commentar = db.ref("aspirasi/"+asp_id).child("comments");
        var response = db.ref("aspirasi/"+asp_id).child("response");
        var usr = db.ref("users/");

        $$(".comment-title").html("Tanggapan: "+ aspirasi_title)

        response.once("value",function(snapshot){
          var res = snapshot.val();
          console.log(res)
          if(res.status=="true"){
            $$(".comment-page").prepend(`<div style="border-radius: 4px; font-size:12px; background:#66ae67; color:white; padding:10px; margin:15px 0;"><strong>Pak Musthofa (Admin)</strong><p>`+ res.message +`</p></div>`);
          }else{
            $$(".comment-page").prepend('<div class="block" style="text-align:center;">Belum ada tanggapan.</div>');
          }
        })

        commentar.on("child_added",function (xx) {
            var obj = xx.val();
            console.log(obj)
            var asp_date = new Date(obj.date_created).getDate();
            var asp_month = new Date(obj.date_created).getMonth();
            var asp_year = new Date(obj.date_created).getFullYear();
            var asp_hour = new Date(obj.date_created).getHours();
            if(asp_hour<10){
              asp_hour="0"+asp_hour
            }

            var asp_minute = new Date(obj.date_created).getMinutes();

            if(asp_minute<10){
              asp_minute="0"+asp_minute
            }
            var asp_all_date = asp_date +' '+month_arr[asp_month]+' '+asp_year+', '+asp_hour+':'+asp_minute;
            
            usr.child(obj.from.id).on("value",function(snap){
              console.log(obj.from.id);
              var usr_name = snap.val().fullname;
              $$(".comment-box").prepend(`<div data-time="`+ asp_all_date +`" style="font-size:12px; background:#f5f5f5; padding:10px; margin:15px 0;  border-radius: 4px; "><strong>`+ usr_name +`</strong><br /><small style="color:#ccc;">`+ asp_all_date +`</small><p>`+ obj.comment +`</p></div>`);
            })
            
            
        });

        if(localStorage.login_status=="false"){
          $$(".inp_comment").hide();
        }else{
          $$(".inp_comment_text").keyup(function(event) {
              if (event.keyCode === 13) {
                $$(".add_comment").click();
              }
          });

          $$(".add_comment").click(function(){
            
            var comment_inp = $$(this).prev("input")
            var comment_msg = $$(this).prev("input").val();
            var comment_asp_id = asp_id;
            var db_comment = db.ref("/aspirasi/"+ comment_asp_id +"/comments");
            
            if(comment_msg!=""){
              $$("#comments-popup-"+ comment_asp_id).find(".page-content").find(".comment-box").html("")

              db_comment.push({
                "from":{
                  "id":localStorage.login_id
                },
                "date_created":Date.now(),
                "comment":comment_msg
              });

              db_comment.on("child_added",function(snapshot){
                var komen = snapshot.val();
                comment_inp.val("");
                var asp_date = new Date(komen.date_created).getDate();
                var asp_month = new Date(komen.date_created).getMonth();
                var asp_year = new Date(komen.date_created).getFullYear();
                var asp_hour = new Date(komen.date_created).getHours();
                var asp_minute = new Date(komen.date_created).getMinutes();
                var asp_all_date = asp_date +' '+month_arr[asp_month]+' '+asp_year+', '+asp_hour+':'+asp_minute;
                setTimeout(addComment(comment_asp_id,komen.from.id,komen.comment, asp_all_date),1000)
                
              });
            }
            
          });

          var addComment = function(aspirasi_id, name, comment, date) {
            var comments = $$("#comments-popup-"+ aspirasi_id).find(".page-content").find(".comment-box");
            comments.prepend(`<div style="font-size:12px; background:#f5f5f5; padding:10px; margin:15px 0;  border-radius: 4px; "><strong>`+ name +`</strong><br /><small  style="color:#ccc;">`+ date +`</small><p>`+ comment +`</p></div>`);
          };
        }

      }
    }
  },
  {
    path: '/berita',
    url: './pages/berita.html',
    on:{
      pageBeforeIn:function(){
        $$(".list_news").html("")
        var news = db.ref("news/");
        var berita_length=0;
        news.on("child_added", function(snapshot){
          var berita = snapshot.val();
          berita_length = snapshot.numChildren();
          
          if(snapshot.exists()){
            if(berita_length>0){
              $$(".empty_state").remove();
              $$(".list_news").css("background","#fafafa").css("text-align","left");
              $$(".list_news").append(`<div class="demo-expandable-cards">
              <div class="card card-expandable">
                <div class="card-content">
                  <div style="background:url(`+ berita.image +`) no-repeat center bottom; background-size: cover; height: 240px" data-background="" class="lazy lazy-fade-in demo-lazy"></div>
                  <a href="#" class="link card-close card-opened-fade-in color-white" style="position: absolute; right: 15px; top: 15px">
                    <i class="icon f7-icons">xmark_circle_fill</i>
                  </a>
                  <div class="card-header display-block" style="height: 60px">
                    `+ berita.title +`
                  </div>
                  <div class="card-content-padding">
                    <p>`+ berita.content +`</p>
                    <p>
                      <a href="#" class="button button-fill button-round button-large card-close">Tutup</a>
                    </p>
                  </div>
                </div>
              </div>`);
            }else{
              $$(".list_news").html(`<div class="row empty_state" style="justify-content:center">
              <img src="`+ empty_graph +`" width="100%" style="opacity:.6" />
              <p>`+ empty_msg +`</p></div>`);
              $$(".list_news").css("background","white").css("text-align","center");
            }
          }else{
            $$(".list_news").html(`<div class="row empty_state" style="justify-content:center">
            <img src="`+ empty_graph +`" width="100%" style="opacity:.6" />
            <p>`+ empty_msg +`</p></div>`);
            $$(".list_news").css("background","white").css("text-align","center");
          }
        });

        if(berita_length<=0){
          $$(".list_news").html(`<div class="row empty_state" style="justify-content:center">
          <img src="`+ empty_graph +`" width="100%" style="opacity:.6" />
          <p>`+ empty_msg +`</p></div>`);
          $$(".list_news").css("background","white").css("text-align","center");
        }
        var lazy_img = app.lazy.create("img.lazy");

        $$(".demo-expandable-cards").click(function(){
          news_opened = true;
        });

        $$(".card-close").click(function(){
          news_opened = false;
        });
      }
    }
  },
  {
    path: '/edit-profile/',
    url: './pages/edit-profile.html',
    on:{
      pageBeforeIn:function(){
        if(localStorage.login_avatar==undefined || localStorage.login_avatar=="#" || localStorage.login_avatar=="0"){
          $$(".my_img").attr("src","https://www.iavm.org/sites/default/files/iavm/staff/blank_avatar.jpg");
        }else{
          $$(".my_img").attr("src",localStorage.login_avatar);
        }
        $$(".my_name").val(localStorage.login_fullname);
        $$(".my_email").val(localStorage.login_email);
        if(localStorage.login_type!="email"){
          $$(".input-password").hide();
        }
        
      },
      pageInit:function(){
        var cam_file;
        
        var this_user = db.ref('users/').child(my_id);
        
        // Camera
        function use_camera(){
          navigator.camera.getPicture(cameraSuccess, cameraError, {
            quality:60,
            correctOrientation:true,
            sourceType:Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
          });
        }
        
        function cameraSuccess(uri){
          console.log("data:image/jpeg;base64,"+uri);
          cam_file = "data:image/jpeg;base64,"+uri;
          $$(".preview_div").show();
          $$(".preview_img").attr("src",cam_file);
          app.dialog.alert("Avatar berhasil diganti. Mohon klik tombol simpan.");
        }

        function cameraError(err){
          app.dialog.alert("Kamera ditutup")
        };

        // Gallery
        function use_gallery(){
          navigator.camera.getPicture(gallerySuccess, galleryError, {
            quality:60,
            correctOrientation:true,
            sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL,
          });
        }
        
        function gallerySuccess(uri){
          console.log(uri);
          cam_file = "data:image/jpeg;base64,"+uri;
          //console.log(cam_file)
          $$(".preview_div").show();
          $$(".preview_img").attr("src",cam_file);
          app.dialog.alert("Avatar berhasil diganti. Mohon klik tombol simpan.")
        }

        function galleryError(err){
          app.dialog.alert("Batal ambil file")
        };

        var ac2 = app.actions.create({
          buttons: [
            {
              text: 'Pilih sumber lampiran',
              label: true
            },
            {
              text: 'Kamera',
              onClick:use_camera
            },
            {
              text: 'Ambil dari file',
              onClick:use_gallery
            },
            {
              text: 'Batal',
              color: 'red'
            },
          ]
        });

        $$(".open-media").click(function(){
          ac2.open();
        });

        function update_user(u_name, email, avatar){
          //localStorage.login_avatar = avatar; 
          var curr_user = user.currentUser;
          if(avatar){
            this_user.update({
              'fullname':u_name,
              'email':email,
              'avatar':avatar
            }).then(function(){
              curr_user.updateEmail(email).then(function(){
                get_currect_user();
                var update_sukses_toast = app.toast.create({
                  text: 'Profil berhasil di update.',
                  closeTimeout: 2000,
                  on: {
                    closed: function () {
                      
                      location.reload();
                    }
                  }
                });
                update_sukses_toast.open();
              })
            })
            .catch(function(){
              app.dialog.alert("Telah terjadi kesalahan. Mohon dicoba lagi.")
            });
          }else{
            console.log(u_name)
            this_user.update({
              'fullname':u_name,
              'email':email
            }).then(function(){
              curr_user.updateEmail(email).then(function(){
                get_currect_user();
                var update_sukses_toast = app.toast.create({
                  text: 'Profil berhasil di update.',
                  closeTimeout: 2000,
                  on: {
                    closed: function () {
                      
                      location.reload();
                    }
                  }
                });
                update_sukses_toast.open();
              })
            })
            .catch(function(){
              app.dialog.alert("Telah terjadi kesalahan. Mohon dicoba lagi.")
            });
          }
        }        

        $$(".save_profile").click(function(){
          var this_password = $$("input.my_password").val();
          var this_email = $$("input.my_email").val();
          var this_name = $$("input.my_name").val();
          var my_user =  user.currentUser;
          //var avatar_dir = storage.child("avatars%2F"+ my_id +".jpg");
          var avatar_dir = storage.child("avatars/"+ my_id +".jpg");
          
          app.dialog.progress("Mengupdate profil...");

          if(this_password){
            if(cam_file){
              my_user.updatePassword(this_password).then(function(){
                avatar_dir.putString(cam_file, 'data_url').then(function(){
                  avatar_dir.getDownloadURL().then(function(url){
                    update_user(this_name,this_email,url);
                  });
                });
              })
              .catch(function(){
                app.dialog.confirm("Tidak dapat update Profil, mohon login ulang.","Gagal Update Profil",function(){
                  firebase.auth().signOut().then(function() {
                    localStorage.login_status = "false";
                    localStorage.login_fullname = "#";
                    localStorage.login_avatar = "#";
                    localStorage.login_id = "0";
                    window.location.reload();
                  }).catch(function(error) {
                    console.log(error);
                  });
                })
              })
            }else{
              my_user.updatePassword(this_password).then(function(){
                update_user(this_name,this_email);
              })
              .catch(function(){
                app.dialog.confirm("Tidak dapat update Profil, mohon login ulang.","Gagal Update Profil",function(){
                  firebase.auth().signOut().then(function() {
                    localStorage.login_status = "false";
                    localStorage.login_fullname = "#";
                    localStorage.login_avatar = "#";
                    localStorage.login_id = "0";
                    window.location.reload();
                  }).catch(function(error) {
                    console.log(error);
                  });
                })
              })
            }
            
          }else{
            if(cam_file){
                avatar_dir.putString(cam_file, 'data_url').then(function(){
                  avatar_dir.getDownloadURL().then(function(url){
                    update_user(this_name,this_email,url);
                  })
                });
              
            }else{
              update_user(this_name,this_email);
            }
          }
        });

      }
    }
  },
  {
    path: '/notifikasi/',
    url: './pages/notifikasi.html',
    on:{
      pageInit:function(){
        
        var notif = db.ref("notification").child(my_id);
        var notif_length = 0;

        notif.orderByChild("date_created").on("child_added", function(snapshot){
          notif_length = snapshot.numChildren();
          console.log(content)
          var content = snapshot.val();
          var date_created_full = new Date(content.date_created).getDate() + ' '+ month_arr[new Date(content.date_created).getMonth()] +' '+ new Date(content.date_created).getFullYear()+ ', ' + new Date(content.date_created).getHours()+ ':' + new Date(content.date_created).getMinutes();
          
          if(notif_length>0){
            $$(".empty_state").remove();
            $$(".my_notification").css("background","#fafafa").css("text-align","left");
            if(content.status=="unread"){
              
              $$(".my_notification ul").prepend(`<li>
                <a href="#" class="item-link item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title"><strong>`+ content.title +`</strong><span class="badge color-red" style="margin-left: 10px;"></span></div>
                      <div class="item-after">`+ date_created_full +`</div>
                    </div>
                    <div class="item-subtitle">`+ content.from +`</div>
                    <div class="item-text">`+ content.message +`</div>
                  </div>
                </a>
              </li>`);
            }else{
              $$(".my_notification ul").prepend(`<li>
                <a href="#" class="item-link item-content">
                  <div class="item-inner">
                    <div class="item-title-row">
                      <div class="item-title">`+ content.title +`</div>
                      <div class="item-after">`+ date_created_full +`</div>
                    </div>
                    <div class="item-subtitle">`+ content.from +`</div>
                    <div class="item-text">`+ content.message +`</div>
                  </div>
                </a>
              </li>`);
            }
          }else{
            $$(".my_notification").html(`<div class="row empty_state" style="justify-content:center">
            <img src="`+ empty_graph +`" width="100%" style="opacity:.6" />
            <p>`+ empty_msg +`</p></div>`);
            $$(".my_notification").css("background","white").css("text-align","center");
          }

          if(notif_length==0){
            $$(".my_notification").html(`<div class="row empty_state" style="justify-content:center">
            <img src="`+ empty_graph +`" width="100%" style="opacity:.6" />
            <p>`+ empty_msg +`</p></div>`);
            $$(".my_notification").css("background","white").css("text-align","center");
          }
        })
      }
    }
  },
  {
    path: '/tulis-aspirasi/',
    url: './pages/tulis.html',
    on:{
      pageInit:function(){
        $$(".preview_div").hide();
        var cam_file;
        var asp_img

        $$(".my_name").html(localStorage.login_fullname);
        if(localStorage.login_avatar==undefined || localStorage.login_avatar=="#" || localStorage.login_avatar=="0"){
          $$(".my_img").attr("src","https://www.iavm.org/sites/default/files/iavm/staff/blank_avatar.jpg");
        }else{
          $$(".my_img").attr("src",localStorage.login_avatar);
        }

        // Read Category
        var cates = db.ref("kategori/");
        cates.on("child_added", function(snapshot){
          var kategori = snapshot.val()
          $$(".sel_category").append("<option value='"+ kategori.name +"'>"+ kategori.name +"</option>")
        })
        
        // Camera
        function use_camera(){
          navigator.camera.getPicture(cameraSuccess, cameraError, {
            quality:60,
            correctOrientation:true,
            sourceType:Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
          });
        }
        
        function cameraSuccess(uri){
          console.log("data:image/jpeg;base64,"+uri);
          cam_file = "data:image/jpeg;base64,"+uri;
          $$(".preview_div").show();
          $$(".preview_img").attr("src",cam_file)
        }

        function cameraError(err){
          app.dialog.alert("Kamera ditutup")
        };

        // Gallery
        function use_gallery(){
          navigator.camera.getPicture(gallerySuccess, galleryError, {
            quality:60,
            correctOrientation:true,
            sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL,
          });
        }
        
        function gallerySuccess(uri){
          console.log(uri);
          cam_file = "data:image/jpeg;base64,"+uri;
          //console.log(cam_file)
          $$(".preview_div").show();
          $$(".preview_img").attr("src",cam_file)
        }

        function galleryError(err){
          app.dialog.alert("Batal ambil file")
        };

        var ac2 = app.actions.create({
          buttons: [
            {
              text: 'Pilih sumber lampiran',
              label: true
            },
            {
              text: 'Kamera',
              onClick:use_camera
            },
            {
              text: 'Ambil dari file',
              onClick:use_gallery
            },
            {
              text: 'Batal',
              color: 'red'
            },
          ]
        });

        $$(".open-media").click(function(){
          ac2.open();
        });

        function submit_aspirasi(id, title, description, category, image){
          var ref= db.ref('aspirasi/'+id);
          
          var newActivity= {
            "description": description,
            "title": title,
            "image": image,
            "category":category,
            "date_created":Date.now(),
            "comments":[],
            "author":{
              "id":localStorage.login_id
            },
            "response":{
              "status":"false",
              "message":"0",
              "date_created":"0"
            },
            "id":id
          }

          
          ref.set(newActivity, function(err){
            if(err){
              alert("Data no go");
            }else{
              var toastBottom = app.toast.create({
                text: 'Aspirasi berhasil dikirim',
                closeTimeout: 2000,
                closeButton: true,
                closeButtonText: 'Lihat Aspirasi',
                closeButtonColor: 'white',
              });

              toastBottom.on("closeButtonClick",function(){
                app.views.main.router.navigate("/semua-aspirasi/")
              })
              app.dialog.close();
              toastBottom.open();
              app.views.main.router.back();
            }
          });
              
          
              
        }

        $$(".send_aspirasi").click(function(){
          var asp_id = Math.floor(100+Math.random()*9000);
          var asp_title = $$(".asp_title").val();
          var asp_category = $$(".sel_category").val();
          var preview_img = $$(".preview_img").attr("src");
          
          var asp_url_img = "lampiran/"+asp_id+".jpg";
          //var asp_url_img = "lampiran%2F"+asp_id+".jpg";
          
          
          if(preview_img && asp_title && asp_category){
            app.dialog.progress("Menambahkan Aspirasi");
            var aspirasi_attachment = storage.child("lampiran/"+asp_id+".jpg");
            aspirasi_attachment.putString(cam_file, 'data_url')
              .on("state_changed",function(snapshot){
                //console.log("selesai");
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');

              
                
              }, function(err){
                switch (err.code) {
                  case 'storage/object-not-found':
                    // File doesn't exist
                    console.log("File doesn't exist")
                    app.dialog.alert("File tidak tersedia.")
                    break;
              
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    console.log("User doesn't have permission to access the object");
                    app.dialog.confirm("Pengguna tidak memiliki izin akses objek, mohon login ulang","Gagal Posting",function(){
                      logout();
                    })
                    break;
              
                  case 'storage/canceled':
                    // User canceled the upload
                    console.log("User canceled the upload")
                    app.dialog.alert("File batal terunggah")
                    break;
              
                  case 'storage/unknown':
                    // Unknown error occurred, inspect the server response
                    console.log("Unknown error occurred, inspect the server response")
                    app.dialog.alert("Terjadi kesalahan, mohon dicoba lagi")
                    break;
                }
              }, function(){
                
                storage.child(asp_url_img).getDownloadURL().then(function(url) {
                  
                  asp_img = url;
                  submit_aspirasi(asp_id,asp_title,asp_title,asp_category,asp_img)
                }).catch(function(error) {
                  app.dialog.close();
                  switch (error.code) {
                    case 'storage/object-not-found':
                      // File doesn't exist
                      console.log("File doesn't exist")
                      app.dialog.alert("File tidak tersedia.")
                      break;
                
                    case 'storage/unauthorized':
                      // User doesn't have permission to access the object
                      console.log("User doesn't have permission to access the object");
                      app.dialog.alert("Pengguna tidak memiliki izin akses objek")
                      break;
                
                    case 'storage/canceled':
                      // User canceled the upload
                      console.log("User canceled the upload")
                      app.dialog.alert("File batal terunggah")
                      break;
                
                    case 'storage/unknown':
                      // Unknown error occurred, inspect the server response
                      console.log("Unknown error occurred, inspect the server response")
                      app.dialog.alert("Terjadi kesalahan, mohon dicoba lagi")
                      break;
                  }
                });
                
                
              })
          }else{
            app.dialog.alert("Mohon lengkapi semua isian")
          }
        })

      }
    }
  },
  {
    path: '/login-screen-page/',
    componentUrl: './pages/login-screen-page.html',
  },
  {
    path: '/signup-screen-page/',
    componentUrl: './pages/signup-screen-page.html',
  },
  {
    path: '/forgot-password/',
    componentUrl: './pages/forgot-password.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];