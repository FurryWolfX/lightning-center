import axios from "axios";
import logger from "./utils/logger";
import { ServiceInfo } from "./types";
import client from "./utils/redis";
/**
 * 检测服务是否存活
 */
export default function initServiceOnlineTimer() {
  setInterval(() => {
    client.get("serviceInfoList", (err, serviceInfoListString) => {
      try {
        const serviceInfoList: ServiceInfo[] = JSON.parse(serviceInfoListString);
        serviceInfoList.forEach(async serviceInfo => {
          try {
            await axios.get(serviceInfo.url + "is-service-online");
            serviceInfo.online = true;
          } catch (e) {
            serviceInfo.online = false;
          }
          const serviceInfoListNew = serviceInfoList.filter(info => info.url !== serviceInfo.url);
          serviceInfoListNew.push(serviceInfo);
          client.set("serviceInfoList", JSON.stringify(serviceInfoListNew), () => {});
        });
      } catch (e) {
        logger.error(e.stack);
      }
    });
  }, 5000);
}
