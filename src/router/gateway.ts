import { all } from "../utils/router";
import { getServiceInfoByName } from "../utils/redis";

all("/gateway/:serviceName/*", async (req, res, next) => {
  const serviceName = req.params.serviceName;
  const url = req.url;
  const serviceInfo = await getServiceInfoByName(serviceName);
  const serviceUrl = url.replace(`/gateway/${serviceName}/`, serviceInfo.url);
  if (req.method === "POST") {
    res.send("用POST向" + serviceUrl + "发送请求，参数是：" + JSON.stringify(req.body));
  } else if (req.method === "GET") {
    res.send("用GET向" + serviceUrl + "发送请求，参数是：" + JSON.stringify(req.query));
  } else {
    res.send("用" + req.method + "向" + serviceUrl + "发送请求");
  }
});
