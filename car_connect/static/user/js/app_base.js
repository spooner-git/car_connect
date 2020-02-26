class DomController{
    draw_layout(install_target){
        let html_to_join = [];
        for(let article in this.install_target){
            let target = this.install_target[article];
            html_to_join.push(
                CComp.container("article", "", null, {id:target.replace(/[.# ]/gi, '')})
            );
        }
        let html = html_to_join.join("");
        this.render(install_target, html);
    }

    render(install_target, html){
        document.querySelector(install_target).innerHTML = html;
    }
}

class AppBase{
    constructor(install_target, background){
        this.install_target = install_target;
        this.background = "transparent"; /*black, white, transparent*/
        this.color_combination = {
            transparent:{icon:"var(--fundamental-white)", bg:"transparent", logo:"/static/common/res/logo/logo1_white.png", shade:"linear-gradient(180deg, black, transparent)"},
            black:{icon:"var(--fundamental-white)", bg:"#282828", logo:"/static/common/res/logo/logo1_white.png", shade:"unset"},
            white:{icon:"var(--fundamental-black)", bg:"#ffffff", logo:"/static/common/res/logo/logo1.png", shade:"unset"},
            nologo:{icon:"var(--fundamental-white)", bg:"transparent", logo:"/static/common/res/logo/logo1_white.png", shade:"linear-gradient(180deg, black, transparent)"}
        };
        if(background != undefined){
            this.background = background;
        }
    }

    change_bg(color){
        this.background = color;
        this.render();
    }

    init(){
        this.render();
    }

    render(){
        document.querySelector(this.install_target).innerHTML = this.assembly();
    }

    assembly(){
        let nav_button_left  = this.dom_nav_button_left();
        let nav_button_right = this.dom_nav_button_right();
        let nav_center_logo = this.dom_center_logo();

        let assembly = 
        CComp.element(
            "div",
            CComp.element(
                "div",
                nav_button_left + nav_center_logo + nav_button_right,
                {"display":"flex", "width":"100%", "max-width":"1024px", "margin":"0 auto"}
            ),
            {"line-height":"80px", "height":"80px", "background-color":this.color_combination[this.background].bg, "background-image":this.color_combination[this.background].shade}
        );

        let html = assembly;
        return html;
    }

    dom_nav_button_left(){
        let id = "nav_button_left";
        let title = CImg.menu([this.color_combination[this.background].icon]);
        let style = {"flex-basis":"50px"};
        let attr = null;
        let onclick = ()=>{
            show_page_popup('nav_menu_popup', POPUP_FROM_LEFT, 100, (e)=>{
                document.querySelector(e.target).innerHTML = this.dom_left_menu();
            });
        };
        let html = CComp.button (id, title, style, attr, onclick);
        return html;
    }

    dom_nav_button_right(){
        let id = "nav_button_right";
        let title = CImg.account([this.color_combination[this.background].icon]);
        let style = {"flex-basis":"50px", "visibility":"hidden"};
        let attr = null;
        let onclick = ()=>{
            // alert('Nav right');
        };
        let html = CComp.button (id, title, style, attr, onclick);
        return html;
    }

    dom_center_logo(){
        let img = CComp.element("img", "", {"max-width":"150px", "vertical-align":"middle"}, {src:this.color_combination[this.background].logo});
        if(this.background == "nologo"){
            img = "";
        }

        let onclick = ()=>{
            location.href = '/';
        };
        let id = "nav_button_center_logo";
        let title = CComp.button(id, img, {"font-size":"22px", "font-weight":900, "display":"inline-block", "color":this.color_combination[this.background].icon, "height":"100%"}, null, onclick);
        let style = {"flex":"1 1 0", "text-align":"center"};
        let html = CComp.div (title, style);
        return html;
    }

    dom_left_menu(){
        let menu1_style = {"padding":"15px 0", "color":"var(--fundamental-white)", "font-size":"20px", "font-weight":"bold", "animation-delay":"0.1s", "animation-duration":"1.5s"};
        let menu2_style = {"padding":"15px 0", "color":"var(--fundamental-white)", "font-size":"20px", "font-weight":"bold", "animation-delay":"0.1s", "animation-duration":"1.5s"};
        let menu3_style = {"padding":"15px 0", "color":"var(--fundamental-white)", "font-size":"20px", "font-weight":"bold", "animation-delay":"0.1s", "animation-duration":"1.5s"};
        let close_style = {"padding":"15px", "color":"var(--fundamental-white)", "position":"absolute", "top":"15px", "right":"15px", "animation-delay":"0.2s", "animation-duration":"1s"};
        let menu1 = CComp.button("menu_search", "Home", menu1_style, {class:"anim_fade_in"}, ()=>{pages.home();layer_popup.close_layer_popup()});
        let menu2 = CComp.button("menu_about", "About Car Connect", menu3_style, {class:"anim_fade_in"}, ()=>{});
        let close = CComp.button("menu_about", CImg.x(["var(--fundamental-white)"]), close_style, {class:"anim_fade_in"}, ()=>{layer_popup.close_layer_popup()});

        let menu_wrapper = CComp.container("div", menu1 + menu2, {"position":"absolute", "top":"50%", "left":"50%", "transform":"translate(-50%, -50%)"}, null);
        let box = CComp.container("div", menu_wrapper + close, {"background-color":"var(--fundamental-black)", "width":"100%", "height":"100%", "position":"relative"}, null);
        
        return box;
    }
}

class Pages{
    constructor(install_target){
        this.install_target = install_target;
        this._home;
        this._map;
    }

    home(data){
        let install_target = this.install_target;
        if(data != undefined){
            if(data.install_target != undefined){
                install_target = data.install_target;
            }
        }
        
        this._home = new Home();
        this._home.draw_layout(install_target);
        this._home.draw_all();
        top_nav.change_bg("transparent");
    }

    map(data){
        let install_target = this.install_target;
        if(data != undefined){
            if(data.install_target != undefined){
                install_target = data.install_target;
            }
        }
        // top_nav.change_bg("white");
        this._map = new Map(data.brand_code);
        this._map.draw_layout(install_target);
        this._map.draw_all();
        top_nav.change_bg("nologo");
    }
}

class MapApi{
    static get_places(place_name, x, y, radius, user_callback){
        let get_data = [];

        let PLACE = place_name == null ? "지하철" : place_name;
        let X = x == null ? 127.06283102249932 : x;
        let Y = y == null ? 37.514322572335935 : y;
        let RADIUS = radius == null ? 1000 : radius;
        let DATA_PER_PAGE = 15;
        CFunc.ajax(
            {
                url:"https://dapi.kakao.com/v2/local/search/keyword.json",
                data:{"y":Y, "x":X, "radius":RADIUS, "query":PLACE, "page":1, "size":DATA_PER_PAGE},
                type:"GET",
                header:{"Authorization": kakao_ak}
            },
            {
                callback:(data)=>{
                    data.documents.forEach((el)=>{
                        get_data.push(el);
                    });
                    let total_count = Number(data.meta.total_count);
                    let _page = 1;
                    let total_page_number = Math.ceil(total_count/DATA_PER_PAGE);

                    if(data.meta.is_end){
                        console.log("PAGE 1 끝", get_data);
                        if(user_callback != undefined){
                            user_callback(get_data);
                        }
                        return get_data;
                    }

                    for(let i=2; i<=total_page_number; i++){
                        CFunc.ajax(
                            {
                                url:"https://dapi.kakao.com/v2/local/search/keyword.json",
                                data:{"y":Y, "x":X, "radius":RADIUS, "query":PLACE, "page":_page, "size":DATA_PER_PAGE},
                                type:"GET",
                                header:{"Authorization": kakao_ak}
                            },
                            {
                                callback:(data)=>{
                                    data.documents.forEach((el)=>{
                                        get_data.push(el);
                                        if(get_data.length == total_count){
                                            console.log(`PAGE ${i} 끝`,get_data);
                                            if(user_callback != undefined){
                                                user_callback(get_data);
                                            }
                                            return get_data;
                                        }
                                    });
                                }
                            }
                        )
                    }


                }
            }
        );
    }
}
