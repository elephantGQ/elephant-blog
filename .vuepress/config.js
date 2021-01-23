module.exports = {
  title: "elephantX",
  description: "闷声发大财",
  dest: "public",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig: {
    nav: [
      {
        text: "首页",
        link: "/",
        icon: "reco-home",
      },
      {
        text: "时间线",
        link: "/timeline/",
        icon: "reco-date",
      },
      {
        text: "文档",
        icon: "reco-message",
        items: [
          {
            text: "vuepress-reco",
            link: "/docs/theme-reco/",
          },
        ],
      },
      {
        text: "联系",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/xgq1995",
            icon: "reco-github",
          },
        ],
      },
    ],
    sidebar: {
      "/docs/theme-reco/": ["", "theme", "plugin", "api"],
    },
    codeTheme: "tomorrow",
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "分类",
      },
      tag: {
        location: 3,
        text: "标签",
      },
    },
    friendLink: [
      {
        title: "GitHub",
        desc: "闷声发大财",
        email: "1336697537@qq.com",
        link: "https://github.com/xgq1995",
      },
      {
        title: "elephantX",
        desc: "个人网站",
        avatar:
          "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://www.elephant-x.xyz/",
      },
    ],
    subSidebar: "auto",
    logo: "/logo.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "相高强",
    authorAvatar: "/avatar.png",
    record: "相高强的博客",
    startYear: "2017",
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    [
      "@vuepress-reco/vuepress-plugin-kan-ban-niang",
      {
        theme: ["z16"],
        clean: true,
        messages:  {
          welcome: '欢迎来到相高强的博客',
          home: '心里的花，我想要带你回家。',
          theme: '好吧，希望你能喜欢我的其他小伙伴。',
          close: '你知道我喜欢吃什么吗？痴痴地望着你。'
        }
      }
    ],
    ['@vuepress-reco/comments', {
      solution: 'vssue',
      options: {
        title: 'vuepress-theme-reco',
        platform: 'github',
        owner: 'xgq1995',
        repo: 'vssue',
        clientId: 'a11648952c96a988bf0d',
        clientSecret: 'e352b6337fd088008dc66ff2111ed365e624f262',
      }
    }]
  ],
};
