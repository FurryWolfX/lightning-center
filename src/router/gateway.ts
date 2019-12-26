import axios from "axios";
import { all } from "../utils/router";
import { getServiceInfoByName } from "../utils/redis";

all("/gateway/:serviceName/*", async (req, res, next) => {
  const serviceName = req.params.serviceName;
  const url = req.url;
  const serviceInfo = await getServiceInfoByName(serviceName);
  const serviceUrl = url.replace(`/gateway/${serviceName}/`, serviceInfo.url);
  if (req.method === "POST") {
    const result = await axios.post(serviceUrl, req.body);
    res.send(result.data);
  } else if (req.method === "GET") {
    const result = await axios.get(serviceUrl, {
      params: req.query
    });
    res.send(result.data);
  } else {
    res.send({
      success: false,
      msg: "暂不支持" + req.method
    });
  }
});
