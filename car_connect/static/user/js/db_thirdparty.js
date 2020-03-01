const CAR_MAKERS = [
    {brand_name:"BMW", image_url:"/static/user/res/bm.png", brand_code:"bm"},
    {brand_name:"벤츠", image_url:"/static/user/res/mb.png", brand_code:"mb"},
    {brand_name:"아우디", image_url:"/static/user/res/ad.png", brand_code:"ad"},
    {brand_name:"폭스바겐", image_url:"/static/user/res/vw.png", brand_code:"vw"},
    {brand_name:"볼보", image_url:"/static/user/res/vv.png", brand_code:"vv"},
    {brand_name:"랜드로버", image_url:"/static/user/res/lr.png", brand_code:"lr"},
    {brand_name:"재규어", image_url:"/static/user/res/jg.png", brand_code:"jg"},
    {brand_name:"푸조", image_url:"/static/user/res/brand_logo/pg.png", brand_code:"pg"},
    {brand_name:"미니", image_url:"/static/user/res/brand_logo/mn.png", brand_code:"mn"},
    {brand_name:"시트로엥", image_url:"/static/user/res/brand_logo/cr.png", brand_code:"cr"},
    {brand_name:"포드", image_url:"/static/user/res/brand_logo/fd.png", brand_code:"fd"},
    {brand_name:"링컨", image_url:"/static/user/res/brand_logo/lc.png", brand_code:"lc"},
    {brand_name:"지프", image_url:"/static/user/res/brand_logo/jp.png", brand_code:"jp"},
    {brand_name:"캐딜락", image_url:"/static/user/res/brand_logo/cd.png", brand_code:"cd"},
    {brand_name:"렉서스", image_url:"/static/user/res/brand_logo/lx.png", brand_code:"lx"},
    {brand_name:"혼다", image_url:"/static/user/res/brand_logo/hd.png", brand_code:"hd"},
    {brand_name:"토요타", image_url:"/static/user/res/brand_logo/ty.png", brand_code:"ty"},
    {brand_name:"인피니티", image_url:"/static/user/res/brand_logo/if.png", brand_code:"if"},
    {brand_name:"닛산", image_url:"/static/user/res/brand_logo/ns.png", brand_code:"ns"},
    {brand_name:"포르쉐", image_url:"/static/user/res/brand_logo/ps.png", brand_code:"ps"},
    {brand_name:"마세라티", image_url:"/static/user/res/brand_logo/mc.png", brand_code:"mc"},
    {brand_name:"DS", image_url:"/static/user/res/brand_logo/ds.png", brand_code:"ds"},
];

const BRAND_CODE_TO_NAME = {
   "bm":"BMW",
   "mb":"메르세데스 벤츠",
   "ad":"아우디",
   "vw":"폭스바겐",
   "vv":"볼보",
   "lr":"랜드로버",
   "jg":"재규어",
   "pg":"푸조",
   "mn":"미니",
   "cr":"시트로엥",
   "fd":"포드",
   "lc":"링컨",
   "jp":"지프",
   "cd":"캐딜락",
   "lx":"렉서스",
   "hd":"혼다",
   "ty":"토요타",
   "if":"인피니티",
   "ns":"닛산",
   "ps":"포르쉐",
   "mc":"마세라티",
   "ds":"DS"
}


const neweclass_cafe = [
   {
      "region":"서울",
      "name":"인모션 렌터카 성수본점",
      "address":"서울시 성동구 성수동 2가 280-4번지 모터시티",
      "workhour":"-",
      "contact":"010-9987-8282",
      "specialty":"렌터카",
      "homepage":"http://cafe.naver.com/neweclass/60370/"
   },
   {
      "region":"경기",
      "name":"인모션 렌터카 일산지점",
      "address":"일산서구 장항동 750-1 메종리브르",
      "workhour":"-",
      "contact":"010-9987-8282",
      "specialty":"렌터카",
      "homepage":"http://cafe.naver.com/neweclass/60370/"
   },
   {
      "region":"경기",
      "name":"휠스미스",
      "address":"경기도 남양주시 불암산로 56",
      "workhour":"-",
      "contact":"010-5485-1081",
      "specialty":"휠수리",
      "homepage":"http://cafe.naver.com/neweclass/358303/"
   },
   {
      "region":"경기",
      "name":"오토소닉스",
      "address":"경기도 고양시 일산동구 백석동 1112-10",
      "workhour":"-",
      "contact":"010-9105-4414",
      "specialty":"오디오/블랙박스",
      "homepage":""
   },
   {
      "region":"경기",
      "name":"다임러오토",
      "address":"경기도 과천시 갈현동 357-26",
      "workhour":"-",
      "contact":"010-5721-1975",
      "specialty":"차량정비",
      "homepage":""
   },
   {
      "region":"경기",
      "name":"벤츠마이스터",
      "address":"경기도 성남시 도촌동 579번지",
      "workhour":"-",
      "contact":"010-5119-5160",
      "specialty":"차량정비",
      "homepage":""
   },
   {
      "region":"경기",
      "name":"세븐그램스",
      "address":"경기도 고양시 일산서구 덕이로 193",
      "workhour":"-",
      "contact":"010-5479-0138",
      "specialty":"덴트/판금/보험수리",
      "homepage":""
   },
   {
      "region":"서울",
      "name":"MBS모터스",
      "address":"서울시 성동구 성수2가 273-40",
      "workhour":"-",
      "contact":"010-6227-5608",
      "specialty":"덴트/판금/보험수리",
      "homepage":""
   },
   {
      "region":"경기",
      "name":"DS모터스",
      "address":"경기도 광주 오포읍 문형리 375-27",
      "workhour":"-",
      "contact":"010-8834-1478",
      "specialty":"덴트/판금/보험수리",
      "homepage":""
   },
   {
      "region":"경기",
      "name":"PGAQ모터스",
      "address":"경기도 파주시 월롱면 휴암로 117번길 84",
      "workhour":"-",
      "contact":"010-5479-0138",
      "specialty":"덴트/판금/보험수리",
      "homepage":""
   }
]