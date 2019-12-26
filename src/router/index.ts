import { all, get, post } from "../utils/router";
import { getGUID } from "../utils";
import { ServiceInfo } from "../types";
import client, { addServiceToList, getServiceList } from "../utils/redis";

all("*", (req, res, next) => {
  next();
});

// 查看服务信息
get("/status", async (req, res) => {
  res.send(await getServiceList());
});

// 注册服务
post("/register", async (req, res) => {
  const params = req.body;
  const serviceInfo: ServiceInfo = {
    guid: getGUID(),
    name: params.name,
    url: params.url,
    online: true
  };
  if (!serviceInfo.name || !serviceInfo.url) {
    res.send({ success: false, error: "参数不全" });
  } else {
    await addServiceToList(serviceInfo);
    res.send({ success: true, info: serviceInfo });
  }
});
