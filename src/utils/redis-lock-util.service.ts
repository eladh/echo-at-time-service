import * as Redis from "ioredis";
import { nanoid } from "nanoid";
import { Injectable } from "@nestjs/common";

const lockTimeoutMs = 1000;
const acquireTimeoutMs = 1000;

@Injectable()
export class RedisLockUtil {
  public static async acquireLock(client: Redis.Redis, lockName: string) {
    const id = nanoid();
    const acquireTimeoutExpire = new Date().getTime() + acquireTimeoutMs;
    let res = null;
    do {
      res = await client.set(lockName, id, "NX", "PX", lockTimeoutMs);
      if (res !== null) {
        return id;
      }
      await sleep(lockTimeoutMs);
    } while (new Date().getTime() < acquireTimeoutExpire);

    return null;
  }

  public static async releaseLock(
    client: Redis.Redis,
    lockName: string,
    id: string
  ) {
    try {
      await client.watch(lockName);
      const value = await client.get(lockName);
      if (value === id) {
        await client.multi().del(lockName).exec();
        return true;
      }
    } catch (e) {
      return false;
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
