let axios = require('axios');
const zp_axios = axios.create({
  baseURL: "http://106.75.154.40:9012/education",
  headers: {
    'Content-Type': 'application/json'
  }
})

function formatTime(date) {
  //date是传入的时间
  const d = new Date(date);
  const month =
    d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  const day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  const hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
  const min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
  const sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
  const times =
    d.getFullYear() +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    min +
    ":" +
    sec;
  return times;
}
module.exports = class {
  static labels = {
    id: "id",
    title: "标题",
    typeId: "分类",
    brief: "简介",
    detail: "详情",
    createBy: "创建者",
    createDate: "创建时间",
    updateBy: "更新者",
    updateDate: "更新时间",
    pic: "图片",
    videoUrl: "视频",
  };
  constructor(
    id,
    title,
    typeId,
    brief,
    pic,
    detail,
    videoUrl,
    createBy,
    createDate,
    updateBy,
    updateDate,
  ) {
    this.id = id || "";
    this.title = title || "";
    this.typeId = typeId || "";
    this.brief = brief || "";
    this.detail = detail || "";
    this.createBy = createBy || "";
    this.createDate = createDate || "";
    this.updateBy = updateBy || "";
    this.updateDate = updateDate || "";
    this.pic = pic || "";
    this.videoUrl = videoUrl || "";
  }

  static getById(id) {
    return new Promise((resolve) => {

      zp_axios.get("/education/" + id).then((res) => {
          if(res.data.data){
            if (res.data.data.createDate)
              res.data.data.createDate =
              formatTime(res.data.data.createDate)
            if (res.data.data.updateDate)
              res.data.data.updateDate =
              formatTime(res.data.data.updateDate)
          }
        resolve([res.data.data]);
      });
    });
  }
  static list(pn, ps) {
    return new Promise((resolve) => {
      zp_axios.get("/education").then((res) => {
        let data = res.data.data;
        data = data.filter((item, index) => index >= (pn - 1) * ps && index < pn * ps);

        data.forEach((item, index) => {
          if (item.createDate) item.createDate =
            formatTime(item.createDate)
          if (item.updateDate) item.updateDate =
            formatTime(item.updateDate)
        })
        let result = [];
        for (let i = 0; i < ps; i++) {
          data[i] ? result.push(data[i]) : "";
        }
        resolve(result);
      });
    });
  }
  static update(obj, id) {
    return new Promise((resolve) => {
      obj[0].createDate = new Date(obj[0].createDate);
      obj[0].updateDate = new Date();
      console.log(obj[0]);
      zp_axios
        .put("/education/update/" + id, obj[0])
        .then((res) => {
          resolve({
            code: res.data.code,
          });
        });
    });
  }
  static add(obj) {
    return new Promise((resolve) => {
      console.log(obj);
      obj.createDate = new Date();
      zp_axios
        .post("/education/add/", obj)
        .then((res) => {
          console.log(obj);
          let code = res.data.code;
          resolve({
            code,
          });
        }).catch(e => console.log(e));
    });
  }
  static delete(id) {
    return new Promise((resolve) => {
      zp_axios
        .delete("/education/delete/" + id)
        .then((res) => {
          let code = res.data.code;
          resolve({
            code,
          });
        });
    });
  }
  static count() {
    return new Promise((resolve) => {
      zp_axios
        .get("/education")
        .then((res) => {
          resolve(res.data.data.length);
        });
    });
  }
};