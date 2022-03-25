const systemConfig = {
    version: "1.0.0",
    baseUrl: "http://localhost:9998",
    imagePrefix: "http://localhost:8080",
    // baseUrl: "http://139.159.224.136:9998",
    // imagePrefix: "http://139.159.224.136",
    appSecret: "2ea616a7451d1f665dd678aa15c71df8",
    appid: "wx3e9616624672b017",
    // 缓存过期时间
    tokenExpire: 1 * 24 * 3600 * 1000,
    singleScore: 5,
}
export default systemConfig;