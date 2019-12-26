import * as redis from "redis";
import logger from "./logger";
import { ServiceInfo } from "../types";

const client = redis.createClient(6379, "127.0.0.1");
client.on("error", function(err) {
  logger.error("[Redis] " + err);
});

export function addServiceToList(serviceInfo: ServiceInfo): Promise<void> {
  return new Promise(async (resolve, reject) => {
    let serviceInfoList: ServiceInfo[] = await getServiceList();
    serviceInfoList = serviceInfoList.filter(info => info.url !== serviceInfo.url);
    serviceInfoList.push(serviceInfo);
    client.set("serviceInfoList", JSON.stringify(serviceInfoList), () => {
      resolve();
    });
  });
}

export function getServiceList(): Promise<ServiceInfo[]> {
  return new Promise((resolve, reject) => {
    client.get("serviceInfoList", (err, serviceInfoListString) => {
      if (err) reject(err);
      if (serviceInfoListString) {
        let serviceInfoList: ServiceInfo[] = JSON.parse(serviceInfoListString);
        resolve(serviceInfoList);
      } else {
        resolve([]);
      }
    });
  });
}

export async function getServiceInfoByName(name: string) {
  const list = await getServiceList();
  return list.find(item => item.name === name);
}

export default client;
