<picker mode='multiSelector' value="{{select}}" range-key="name" range='{{range}}' bindchange="change" style="border:1px solid #ccc;" bindcolumnchange="cloumnchange" >
{{city[select[0]].name}}-{{city[select[0]].city[select[1]].name}}
</picker>
var city=require ('../../city.js');
Page({

/**
* 页面的初始数据
*/
data: {
select:[2,0],
range: [],
city:city
},

/**
* 生命周期函数--监听页面加载
*/
onLoad: function (options) {
var user={Province:"福建",City:"厦门"};

var shen= city;
var currentShen = city.filter(
function (s) {
return s.name == user.Province
}
)[0];
var shi = currentShen.city;

this.data.range=[shen,shi];
this.setData({
range:this.data.range,
select: [city.indexOf(currentShen), currentShen.city.findIndex(function (s) {
return s.name == user.City
})]
})
},
change:function(event){
console.log(event);
this.setData({select:event.detail.value});
},
cloumnchange: function (event) {
console.log(event);
if(event.detail.column==0){
var shenIndex=event.detail.value;
var shi=city[shenIndex].city;
this.setData({
"range[1]":shi
})
}
},
/**
* 生命周期函数--监听页面初次渲染完成
*/
onReady: function () {

},

/**
* 生命周期函数--监听页面显示
*/
onShow: function () {

},

/**
* 生命周期函数--监听页面隐藏
*/
onHide: function () {

},

/**
* 生命周期函数--监听页面卸载
*/
onUnload: function () {

},

/**
* 页面相关事件处理函数--监听用户下拉动作
*/
onPullDownRefresh: function () {

},

/**
* 页面上拉触底事件的处理函数
*/
onReachBottom: function () {

},

/**
* 用户点击右上角分享
*/
onShareAppMessage: function () {

}
})