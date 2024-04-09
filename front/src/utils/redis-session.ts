import Redis from 'ioredis';

type Options = {
  scanCount?: number;
  serializer?: typeof JSON;
  client?: Redis;
  ttl?: number;
  disableTTL?: boolean;
  disableTouch?: boolean;
};

type Session = {
  cookie?: {
    expires?: string;
  };
  id?: number;
  mail?: string;
  name?: string;
  filename?: string;
  role?: string;
};

export default class RedisSession {
  prefix: string;
  scanCount: number;
  serializer: typeof JSON;
  client: Redis;
  ttl: number;
  disableTTL: boolean;
  disableTouch: boolean;

  constructor(options: Options = {}) {
    this.prefix = '';
    this.scanCount = Number(options.scanCount) || 100;
    this.serializer = options.serializer || JSON;
    this.client = options.client || new Redis();
    this.ttl = options.ttl || 1800;
    this.disableTTL = options.disableTTL || false;
    this.disableTouch = options.disableTouch || false;
  }

  async get(sid: string) {
    let key = this.prefix + sid;
    let data = await this.client.get(key);
    if (!data) return null;

    let value;
    try {
      value = this.serializer.parse(data);
    } catch (err) {
      return null;
    }
    return value;
  }

  async set(sid: string, sess: Session) {
    let value;
    try {
      value = this.serializer.stringify(sess);
    } catch (err) {
      return null;
    }

    let ttl = 1;
    if (!this.disableTTL) {
      ttl = this._getTTL(sess);
    }

    if (ttl > 0) {
      return await this.client.set(this.prefix + sid, value, 'EX', ttl);
    } else {
      return await this.destroy(sid);
    }
  }

  async touch(sid: string, sess: Session) {
    if (this.disableTouch || this.disableTTL) return null;

    let key = this.prefix + sid;
    let err = await this.client.expire(key, this._getTTL(sess));
    return err;
  }

  async destroy(sid: string) {
    let key = this.prefix + sid;
    let err = await this.client.del(key);
    return err;
  }

  async clear() {
    let keys = await this.client.keys(this.prefix + '*');
    if (!keys) return null;

    keys.forEach(async (key: string) => {
      await this.client.del(key);
    });
  }

  _getTTL(sess: Session) {
    let ttl;
    if (sess && sess.cookie && sess.cookie.expires) {
      let ms = Number(new Date(sess.cookie.expires));
      ttl = Math.ceil(ms / 1000);
    } else {
      ttl = this.ttl;
    }
    return ttl;
  }
}
