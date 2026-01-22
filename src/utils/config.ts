interface Config {
  proxyUrl: string,
  userUrl: string,
  baseUrl: string,
  frontend: {
    baseUrl: string,
    recordUrl: string
  }
}

const productionConfig: Config = {
  proxyUrl: "https://clinic-bitnp.info.bit.edu.cn/proxy",
  userUrl: "https://clinic-bitnp.info.bit.edu.cn/user",
  baseUrl: "/api",
  frontend: {
    baseUrl: "https://clinic-test.bitnp.net",
    recordUrl: "/records/"
  }
}

const developmentConfig: Config = {
  proxyUrl: "/proxy",
  userUrl: "/user",
  baseUrl: "/api",
  frontend: {
    baseUrl: "https://clinic-test.bitnp.net",
    recordUrl: "/records/"
  }
}

export {
  productionConfig,
  developmentConfig
}