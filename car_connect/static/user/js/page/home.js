class Home extends DomController{
    constructor(){
        super();
        this.install_target = {
            search_box:"#search_box"
        };
    }

    init(){

    }

    draw_layout(install_target){
        let search_box = CComp.container(
                                            /*type*/ "article", 
                                            /*title*/ "", 
                                            /*style*/ {"height":"auto", "padding-top":"100px", "min-height":"100vh"}, 
                                            /*attr*/ {id:this.install_target.search_box.replace(/#/, ''), class:"search_box_bg_image article_padding"});
        let html = search_box;

        this.render(install_target, html);
    }

    draw_all(){
        this.draw_search_box();
    }

    draw_search_box(install_target){
        install_target = install_target == undefined ? this.install_target.search_box : install_target;
        let html = 
            CComp.container("div", 
                                this.dom_search_box_title() + this.dom_car_makers_list(), 
                                null,
                                 null);
        this.render(install_target, html);
    }

    dom_search_box_title(){
        let title = CComp.text(/*title*/ "수입차 전시장 <br>서비스 센터 <br>바로 검색", /*style*/ {"font-size":"2.0em", "font-weight":"bold", "color":"var(--font-invisible)", "word-break":"keep-all"}, /*attr*/{});
        let html = CComp.container(/*type*/ "div", 
                                        /*title*/ title, 
                                        /*style*/ {"margin":"0 auto", "margin-bottom":"30px", "max-width":"600px", "animation-duration":"1s"}, 
                                        /*attr*/ {class:"anim_fade_in"});
        return html;
    }

    dom_car_makers_list(){
        let dom_assembly =
            CAR_MAKERS.map((brand, index)=>{
                let image_wrap = 
                    CComp.element("img", "", {"height":"30px", "line-height":"30px"}, {"src":`/static/user/res/brand_logo/${brand.brand_code}.png`})
                let brand_name =
                    CComp.element("div", CComp.text(brand.brand_name), {"height":"25px", "line-height":"25px"})

                let dom = 
                CComp.button(
                    `brand_${index}`, image_wrap + brand_name, 
                    {"display":"inline-block", "width":"20%", "height":"80px", "vertical-align":"top", "color":"var(--font-invisible)", "font-size":"13px"}, 
                    {class:"anim_hover"}, 
                    ()=>{pages.map({brand_code:brand.brand_code});}
                );
                return dom;
            });
        let html = 
            CComp.container("div", dom_assembly.join(""), 
                {"margin":"0 auto", "margin-top":"30px", "max-width":"600px", "padding-top":"10px", "padding-bottom":"20px", "box-shadow":"0 0 16px 0 #282828", "background-color":"#222", "border-radius":"4px"},
                {class:"anim_fade_in"})

        // let html = dom_assembly.join("");
        return html;
    }
}

class Map extends DomController{
    constructor(initial_selected_brand){
        super();
        this.install_target = {
            map_box:"#map_box",
            overlay:"#map_overlay",
            pin_desciption:"#map_overlay_pin_description",
            overlay_utility:"#map_overlay_utility",
            road_view:"#road_view"
        };
        this.swiper = null;
        this.map;
        this.infowindow;
        this.map_markers = [];
        this.selected_marker = null;
        this.selected_marker_description = null;
        this.roadview_custom_overlays = [];

        this.initial_selected_brand = initial_selected_brand;

        this.selected_maker = this.initial_selected_brand == undefined ? [] : [this.initial_selected_brand];
        this.overlay_car_makers_list_expand = OFF;
        this.overlay_car_makers_list_visible = ON;
        this.overlay_pin_description_visible = OFF;
        this.toggle_dealership = ON;
        this.toggle_service = OFF;
    }
    
    draw_all(){
        this.draw_map_box();
        this.draw_overlay_carmakers();
        this.draw_overlay_utility();
        this.draw_roadview();
    }

    draw_map_box(install_target){
        install_target = install_target == undefined ? this.install_target.map_box : install_target;
        let html = CComp.container("div", "", {"height":"100vh"}, {id:"map_container"});
        this.render(install_target, html);
        this.draw_kakao_map("#map_container", ()=>{
            this.get_dealership_data((dealership)=>{
                this.kakao_setMarkers(dealership);
            });
        })
    }

    draw_overlay(){
        this.draw_pin_description();
        this.draw_overlay_carmakers();
        this.draw_overlay_utility();
    }

    draw_pin_description(install_target){
        install_target = install_target == undefined ? this.install_target.pin_desciption : install_target;
        let html = this.overlay_pin_description();
        this.render(install_target, html);
    }

    draw_overlay_carmakers(install_target){
        install_target = install_target == undefined ? this.install_target.overlay : install_target;
        let html = this.overlay_car_makers_list();
        this.render(install_target, html);
    }

    draw_overlay_utility(install_target){
        install_target = install_target == undefined ? this.install_target.overlay_utility : install_target;
        let html = this.overlay_utility();
        this.render(install_target, html);
    }

    draw_kakao_map(install_target, callback){

        navigator.geolocation.getCurrentPosition((data)=>{
            this.infowindow = new kakao.maps.InfoWindow({zIndex:1});
            let $map_container = document.querySelector(install_target);
            let X = data.coords.longitude;
            let Y = data.coords.latitude;
            let map_options = {
                center: new kakao.maps.LatLng(Y, X), //지도 중심 좌표
                level: 5 //지도 레벨 (확대 축소)
            };
            this.map = new kakao.maps.Map($map_container, map_options);
            if(callback != undefined){
                callback();
            }
    
        },()=>{
            this.infowindow = new kakao.maps.InfoWindow({zIndex:1});
            let $map_container = document.querySelector(install_target);
            let X = 126.950263528489;
            let Y = 37.499483853924;
            let map_options = {
                center: new kakao.maps.LatLng(Y, X), //지도 중심 좌표
                level: 5 //지도 레벨 (확대 축소)
            };
            this.map = new kakao.maps.Map($map_container, map_options);
            if(callback != undefined){
                callback();
            }
        });

    }

    draw_roadview(install_target){
        install_target = install_target == undefined ? this.install_target.road_view : install_target;
        let html = CComp.container("div", "", {"width":"100%", "height":"100%"}, {id:"roadview_wrapper"})+this.overlay_roadview();
        this.render(install_target, html);
    }

    kakao_displayMarker(place){
        const brand_code = place.brand_code;
        const x = place.x;
        const y = place.y;
        var image_type = "";
        var image_height = 50;
        if(place.type == "service"){
            image_type = "_service";
            image_height = 60;
        }

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var imageSize = new kakao.maps.Size(40, image_height);
        var imageOptions = {
            offset: new kakao.maps.Point(20, image_height),
            zIndex: 1
        };    
        var markerImage = new kakao.maps.MarkerImage(`/static/user/res/brand_logo_marker/${brand_code}${image_type}.png`, imageSize, imageOptions);
        var markerImageClicked = new kakao.maps.MarkerImage(`/static/user/res/brand_logo_marker/${brand_code}${image_type}_selected.png`, imageSize, imageOptions)
        var markerPosition = new kakao.maps.LatLng(y, x); // 마커가 표시될 위치입니다

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage // 마커이미지 설정 
        });
        marker.normalImage = markerImage;
        marker.coordX = x;
        marker.coordY = y;

        kakao.maps.event.addListener(marker, "click", ()=>{
            if(!this.selected_marker || this.selected_marker !== marker){
                !!this.selected_marker && this.selected_marker.setImage(this.selected_marker.normalImage);
                marker.setImage(markerImageClicked);
                marker.setZIndex(1);
                if(this.selected_marker != null){
                    this.selected_marker.setZIndex(0);
                };

                this.map.panTo(markerPosition);

            }else if(!this.selected_marker || this.selected_marker === marker){
                this.unselect_car_maker();
                return;
            }
            this.selected_marker_description = place;
            this.selected_marker = marker;
            this.overlay_pin_description_visible = ON;
            this.overlay_car_makers_list_expand = OFF;
            this.overlay_car_makers_list_visible = OFF;
            this.draw_overlay();
        });


        this.map_markers.push(marker);
        marker.setMap(this.map); 
    }

    db_add_geo(data){
    //주소로 x,y 좌표 찾아서 json데이터의 property에 추가하기
        var geocoder = new kakao.maps.services.Geocoder();

        let new_data = [];
        data.forEach((el)=>{
            geocoder.addressSearch(el.address, (result, status)=>{
                if(status === kakao.maps.services.Status.OK){
                    let X = result[0].x;
                    let Y = result[0].y;
                    let geo = {"x":X, "y":Y};
                    new_data.push({...el, ...geo});
                    if(new_data.length == data.length){
                        console.log(new_data)
                        console.log(JSON.stringify(new_data))
                        return new_data;
                    }
                }else{
                    console.log("failed",el)
                }
            });
        });
    }

    kakao_setMarkers(result){
        if(result.length == 0){
            this.kakao_removeMarkers();
            return;
        }
        
        // let current_level = this.map.getLevel();
        // let bounds = new kakao.maps.LatLngBounds();
        this.kakao_removeMarkers();
        for (var i=0; i<result.length; i++) {
            this.kakao_displayMarker(result[i]);
            // bounds.extend(new kakao.maps.LatLng(result[i].y, result[i].x));
        }
    }

    kakao_removeMarkers(){
        this.map_markers.forEach((el)=>{el.setMap(null);});
        this.map_markers = [];
        this.infowindow.close();
    }

    kakao_createMarkerImage(src, size, options) {
        var markerImage = new kakao.maps.MarkerImage(src, size, options);
        return markerImage;            
    }
    
    // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
    kakao_createMarker(position, image) {
        var marker = new kakao.maps.Marker({
            position: position,
            image: image
        });
        return marker;  
    }   

    kakao_address_to_coords_convert(address, callback_){
        CFunc.ajax({
            data:{query:address},
            type:"GET",
            url:"https://dapi.kakao.com/v2/local/search/address.json",
            header:{"Authorization":kakao_ak}
        }, {callback:(resp)=>{if(callback_!= undefined){callback_({"x":resp.documents[0].x, "y":resp.documents[0].y})};console.log("x", resp.documents[0].x, "y", resp.documents[0].y)}});
    }

    get_dealership_data(callback){
        let dealership_data = CAR_MAKERS_DEALERSHIP;
        let result = [];
        if(this.toggle_dealership == ON){
            this.selected_maker.forEach((brand)=>{
                let dealership_list = dealership_data[brand];
                for(let i=0; i<dealership_list.length; i++){
                    dealership_list[i]["type"] = "dealership";
                    result.push(dealership_list[i]);
                }
            });
        }
        let service_data = CAR_MAKERS_SERVICE;
        if(this.toggle_service == ON){
            this.selected_maker.forEach((brand)=>{
                let service_center_list = service_data[brand];
                for(let i=0; i<service_center_list.length; i++){
                    service_center_list[i]["type"] = "service";
                    result.push(service_center_list[i]);
                }
            });
        }
        // this.db_add_geo(service_data.ds);
        callback(result);
    }

    overlay_pin_description(){
        let visible = this.overlay_pin_description_visible;
        if(visible == OFF){
            return "";
        }
        let place = this.selected_marker_description;
        if(place == null){
            return "";
        }
        const brand_name = BRAND_CODE_TO_NAME[place.brand_code];
        const brand_code = place.brand_code;
        const region = place.region;
        const name = place.name;
        const address = place.address;
        const workhour = place.workhour;
        const contact = place.contact;
        const dealership = place.dealership;
        const x = place.x;
        const y = place.y;

        let first_line = 
            CComp.container(
                "div",
                CComp.element("img", "", {"vertical-align":"middle", "margin-bottom":"3px"}, {"src":`/static/user/res/brand_logo/${brand_code}.png`}) + 
                CComp.text(`${name}`) +
                // CComp.text(region, {"font-weight":"normal", "font-size":"12px"}) +
                CComp.button("close_pin_description", CImg.x(["#ffffff"]), {"float":"right"}, null, ()=>{
                    this.unselect_car_maker();
                }),
                {"font-size":"16px", "font-weight":"bold", "margin-bottom":"10px"}
            );
        let second_line =
            CComp.container(
                "div",
                CComp.element("div", address, {"font-size":"13px"})
            )
        let third_line = 
            CComp.container(
                "div",
                CComp.element("div", workhour, {"font-size":"13px"})
            )
        let fourth_line = 
            CComp.container(
                "div",
                CComp.element("div", contact.replace(/[()]/gi,"-") + ' ' + dealership, {"font-size":"13px"}) 
                // CComp.element("div", dealership, {"font-size":"13px"})
            )
        let last_line = 
            CComp.container(
                "div",
                CComp.button(`roadview_${contact.replace(/[- ())]/gi,"")}`, "로드뷰", {"background-color":"#282828", "border":"1px solid #ffffff", "border-radius":"3px", "flex":"1 1 0", "line-height":"27px", "margin-right":"5px"}, null, ()=>{this.user_event_roadView(place)}) +
                CComp.button(`call_to_${contact.replace(/[- ()]/gi,"")}`, "전화걸기", {"background-color":"#282828", "border":"1px solid #ffffff", "border-radius":"3px", "flex":"1 1 0", "line-height":"27px", "margin-right":"5px"}, null, ()=>{document.location.href = `tel:${contact.replace(/[- )]/gi,"")}`}) +
                CComp.button(`move_to_${contact.replace(/[- ())]/gi,"")}`, "카카오 네비", {"background-color":"#282828", "border":"1px solid #ffffff", "border-radius":"3px", "flex":"1 1 0", "line-height":"27px", "margin-right":"5px"}, null, ()=>{this.user_event_go_to_kakao_navi({"place_name":brand_name +' '+ name, "x":x, "y":y})}) +
                CComp.button(`copy_${contact.replace(/[- ())]/gi,"")}`, "주소 복사", {"background-color":"#282828", "border":"1px solid #ffffff", "border-radius":"3px", "flex":"1 1 0", "line-height":"27px", "margin-right":"5px"}, null, ()=>{this.user_event_copy_address(address)}),
                // CComp.button(`sample_${contact.replace(/[- )]/gi,"")}`, "전시 차량", {"background-color":"#282828", "border":"1px solid #ffffff", "border-radius":"3px", "flex":"1 1 0", "line-height":"32px"}, null, ()=>{alert(`전시차량 정보: ${address}`)}),
                {"display":"flex", "height":"35px", "margin-top":"10px", "font-size":"12px", "letter-spacing":"-1px"}
            )
        let random_commercial = randomArry(commercial_banners);
        let commercial_line = 
            CComp.container(
                "div",
                CComp.container("div", "", {"padding-top":"30%"}),
                {"background-image":`url('${random_commercial.url}')`, "background-size":"cover", "background-position":"center", "background-repeat":"no-repeat", "margin-top":"15px"},
                {id:"commercial_banner"},
                {
                    type:"click", 
                    exe: ()=>{
                        let new_window = window.open("about:blank");
                        new_window.location.href = random_commercial.landing;
                    }
                }
            )
        
        let html = 
            CComp.container(
                "div",
                first_line + second_line + third_line + fourth_line + last_line + commercial_line,
                {"display":this.overlay_pin_description_visible == ON ? "block" : "none", "position":"fixed", "bottom":"20px", "width":"90%", "max-width":"550px", "height":"auto", "z-index":"10", "left":"50%", "transform":"translateX(-50%)", "overflow-x":"auto", "overflow-y":"hidden", "background-color":"rgba(40, 40, 40, 0.95)", "color":"#ffffff", "padding":"10px 20px 20px 20px", "border-radius":"10px"},
                // {class:"anim_fade_in"}
            );
        return html;
    }
    
    overlay_car_makers_list(){
        let container_expand_size = "60vh";
        let container_contract_size = "50px";

        let dom_assembly =
            CComp.container(
                "div",
                CAR_MAKERS.map((brand, index)=>{
                    let dom = this.element_car_maker(brand, index)
                    return dom;
                }).join(""),
                {"overflow-y":"auto", "height":"calc(100% - 50px)"},
                {id:"car_makers_list_wrap"}
            )
            
        let button = 
            CComp.button(
                "toggle_car_maker_list",
                CImg.arrow_expand(["#ffffff"], this.overlay_car_makers_list_expand == OFF ? {"transform":"rotate(180deg)"} : null),
                {"height":"50px", "line-height":"44px"},null,
                ()=>{
                    if(this.overlay_car_makers_list_expand == ON){
                        this.overlay_car_makers_list_expand = OFF;
                    }else{
                        this.overlay_car_makers_list_expand = ON;
                    }
                    // this.draw_overlay_carmakers();
                    this.overlay_pin_description_visible = OFF;
                    this.draw_overlay();
                    this.unselect_car_maker();
                }
            )
        let html = 
            CComp.container(
                "div",
                button + 
                dom_assembly,
                {"display":this.overlay_car_makers_list_visible == OFF ? "none" : "block", "position":"fixed", "bottom":"20px", "width":"90%", "max-width":"550px", "height":this.overlay_car_makers_list_expand == ON ? container_expand_size : container_contract_size, "z-index":"10", "left":"50%", "transform":"translateX(-50%)", "overflow":"hidden", "background-color":"rgba(40, 40, 40, 0.85)", "border-radius":"10px"},
                {id:"overlay_car_maker_list", class:""}
            );
        return html;
    }

    overlay_utility(){
        let html = 
            CComp.container(
                "div",
                CComp.button("map_zoom_in", CImg.zoom_in(["#ffffff"], {"margin-top":"4px"}), {"box-shadow":"0 0 5px 0 #cccccc", "background-color":"rgba(40, 40, 40, 0.85)", "width":"40px", "height":"40px", "border-radius":"5px", "margin-bottom":"10px"}, null, ()=>{this.kakao_zoom_in()})+
                CComp.button("map_zoom_out", CImg.zoom_out(["#ffffff"], {"margin-top":"4px"}), {"box-shadow":"0 0 5px 0 #cccccc", "background-color":"rgba(40, 40, 40, 0.85)", "width":"40px", "height":"40px", "border-radius":"5px", "margin-bottom":"10px"}, null, ()=>{this.kakao_zoom_out()}) +
                CComp.button("map_zoom_point", CImg.zoom_point(["#ffffff"], {"margin-top":"4px"}), {"box-shadow":"0 0 5px 0 #cccccc", "background-color":"rgba(40, 40, 40, 0.85)", "width":"40px", "height":"40px", "border-radius":"5px", "margin-bottom":"10px"}, null, ()=>{this.kakao_zoom_point()}) +
                CComp.button("map_zoom_fit", CImg.zoom_fit(["#ffffff"], {"margin-top":"4px"}), {"box-shadow":"0 0 5px 0 #cccccc", "background-color":"rgba(40, 40, 40, 0.85)", "width":"40px", "height":"40px", "border-radius":"5px", "margin-bottom":"10px"}, null, ()=>{this.kakao_zoom_fit()}),
                {position:"absolute", top:"90px", right:"10px", "z-index":"9"}
            )+
            CComp.container(
                "div",
                CComp.button("toggle_dealership", "전시장", {"box-shadow":"0 0 5px 0 #cccccc", "background-color":`rgba(40, 40, 40, ${this.toggle_dealership == ON ? 0.9 : 0.6})`, "color":"#ffffff", "font-size":"13px", "width":"auto", "height":"40px", "line-height":"32px", "border-radius":"5px", "margin-bottom":"10px"}, null, ()=>{this.user_event_toggle_dealership()})+
                CComp.button("toggle_service", "서비스센터", {"box-shadow":"0 0 5px 0 #cccccc", "background-color":`rgba(40, 40, 40, ${this.toggle_service == ON ? 0.9 : 0.6})`, "color":"#ffffff", "font-size":"13px", "width":"auto", "height":"40px", "line-height":"32px", "border-radius":"5px", "margin-bottom":"10px"}, null, ()=>{this.user_event_toggle_service()}),
                {position:"absolute", top:"90px", left:"10px", "z-index":"9"}
            );
        return html;
    }

    overlay_roadview(){
        let html =
            CComp.container(
                "div",
                CComp.button("div", "로드뷰 종료", {"width":"250px", "height":"40px", "line-height":"34px", "background-color":"#222", "color":"#fff", "font-size:":"14px", "font-weight":"500", "border-radius":"10px"}, null, ()=>{
                    $("#road_view").removeClass("roadview_visible");
                }),
                {"position":"fixed", "top":"20px", "left":"50%", "transform":"translateX(-50%)", "z-index":"1500"}
            )
        return html;
    }

    element_car_maker(data, index){
        let selected = false;
        if(this.selected_maker.indexOf(data.brand_code) != -1){
            selected = true;
        }

        let color = selected == true ? "gold" : "#ffffff";
        let fontWeight = selected == true ? "bold" : "";
        
        let image_wrap = 
            CComp.element("img", "" ,{"height":"30px", "line-height":"30px"}, {"src":`/static/user/res/brand_logo/${data.brand_code}.png`})
        let brand_name =
            CComp.element("div", CComp.text(data.brand_name, {"font-size":"12px", "color":color, "font-weight":fontWeight}), {"height":"20px", "line-height":"20px"})

        let comp = 
        CComp.button(
            `brand_${index}`, image_wrap + brand_name, 
            {"display":"inline-block", "width":"20%", "height":"70px", "vertical-align":"top"}, 
            {class:""}, 
            ()=>{
                let brand_code = data.brand_code
                let index = this.selected_maker.indexOf(brand_code);
                if(index == -1){
                    this.selected_maker.push(data.brand_code);
                }else{
                    this.selected_maker.splice(index, 1);
                }
                this.draw_overlay_carmakers();
                this.get_dealership_data((dealership)=>{
                    this.kakao_setMarkers(dealership);
                });
            }
        );

        return comp;
    }

    unselect_car_maker(){
        this.overlay_car_makers_list_visible = ON;
        this.overlay_pin_description_visible = OFF;
        this.selected_marker = null;
        this.selected_marker_description = null;
        this.get_dealership_data((dealership)=>{
            this.kakao_setMarkers(dealership);
            this.draw_overlay();
        });
    }

    user_event_go_to_kakao_navi(place){
        // Kakao.init(kakao_nav_ak);
        Kakao.Navi.start({
            name:place.place_name,
            x:Number(place.x),
            y:Number(place.y),
            coordType:'wgs84'
        });
    }

    user_event_copy_address(address){
        var t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = address;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        alert("복사 되었습니다.");
    }

    user_event_toggle_dealership(){
        if(this.toggle_dealership == ON){
            this.toggle_dealership = OFF;
        }else if(this.toggle_dealership == OFF){
            this.toggle_dealership = ON;
        }
        this.draw_overlay_utility();
        this.get_dealership_data((dealership)=>{
            this.kakao_setMarkers(dealership);
        });
    }

    user_event_toggle_service(){
        if(this.toggle_service == ON){
            this.toggle_service = OFF;
        }else if(this.toggle_service == OFF){
            this.toggle_service = ON;
        }
        this.draw_overlay_utility();
        this.get_dealership_data((dealership)=>{
            this.kakao_setMarkers(dealership);
        });
    }

    user_event_roadView(place){
        const brand_name = BRAND_CODE_TO_NAME[place.brand_code];
        const brand_code = place.brand_code;
        const region = place.region;
        const name = place.name;
        const address = place.address;
        const workhour = place.workhour;
        const contact = place.contact;
        const dealership = place.dealership;
        const x = place.x;
        const y = place.y;

        let roadviewContainer = document.getElementById("roadview_wrapper");
        let roadview = new kakao.maps.Roadview(roadviewContainer);
        let roadviewClient = new kakao.maps.RoadviewClient();
        let position = new kakao.maps.LatLng(y, x);

        roadviewClient.getNearestPanoId(position, 50, (panold)=>{
            roadview.setPanoId(panold, position);
        });

        $('#road_view').addClass("roadview_visible");

        var roadviewTargetOverlayContent = 
            CComp.container(
                "div",
                CComp.element("div", CComp.element("img","",{"vertical-align":"middle"},{"src":`/static/user/res/brand_logo/${brand_code}.png`}) + ' ' + name, {"font-size":"14px", "font-weight":"bold"})+
                CComp.element("div", address, {"height":"auto", "margin":"10px 0"})+
                CComp.element("div", dealership, {"height":"auto"})+
                CComp.element("div", "", {"position":"absolute", "bottom":"-10px", "border":"10px solid rgba(40, 40, 40, 0.95)", "border-left-color":"transparent", "border-top-color":"transparent", "transform":"rotate(45deg)"}),
                {"background-color":"rgba(40, 40, 40, 0.95)", "color":"#fff", "font-size":"13px", "padding":"10px", "border-radius":"8px", "position":"relative", "min-width":"150px"}
            )
        

        kakao.maps.event.addListener(roadview, 'init', ()=>{
            this.roadview_custom_overlays.forEach((el)=>{
                el.setMap(null);
                this.roadview_custom_overlays = [];
            })

            this.roadviewTargetOverlay = new kakao.maps.CustomOverlay({
                position:position,
                content:roadviewTargetOverlayContent,
                // xAnchor:0.5,
                yAnchor:1.1
            });

            this.roadviewTargetOverlay.setMap(roadview);
            var projection = roadview.getProjection();
            var viewpoint = projection.viewpointFromCoords(this.roadviewTargetOverlay.getPosition(), this.roadviewTargetOverlay.getAltitude());
            roadview.setViewpoint(viewpoint);

            this.roadview_custom_overlays.push(this.roadviewTargetOverlay);
        })
        

    }

    kakao_zoom_in(){
        this.map.setLevel(this.map.getLevel() - 1);
    }

    kakao_zoom_out(){
        this.map.setLevel(this.map.getLevel() + 1);
    }

    kakao_zoom_point(){
        this.map.setLevel(2);
        if(this.selected_marker != null){
            var markerPosition = new kakao.maps.LatLng(Number(this.selected_marker.coordY), Number(this.selected_marker.coordX) );
            this.map.panTo(markerPosition);
        }
    }

    kakao_zoom_fit(){
        this.map.setLevel(5);
        if(this.selected_marker != null){
            var markerPosition = new kakao.maps.LatLng(Number(this.selected_marker.coordY), Number(this.selected_marker.coordX) );
            this.map.panTo(markerPosition);
        }
    }

}
