import axios from "axios";
import logger from "./utils/logger";
import { ServiceInfo } from "./types";
import { getServiceList, addServiceToList } from "./utils/redis";
/**
 * 检测服务是否存活
 */
export default function initServiceOnlineTimer() {
  setInterval(async () => {
    try {
      const serviceInfoList: ServiceInfo[] = await getServiceList();
      serviceInfoList.forEach(async serviceInfo => {
        try {
          await axios.get(serviceInfo.url + "is-service-online");
          serviceInfo.online = true;
        } catch (e) {
          serviceInfo.online = false;
        }
        await addServiceToList(serviceInfo);
      });
    } catch (e) {
      logger.error(e.stack);
    }
  }, 5000);
}
