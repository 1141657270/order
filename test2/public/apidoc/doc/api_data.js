define({ "api": [
  {
    "type": "get",
    "url": "/ads/get",
    "title": "轮播图管理",
    "name": "get",
    "group": "ads",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "keyword3",
            "description": "<p>所要搜索的内容</p>"
          }
        ]
      },
      "examples": [
        {
          "title": ":",
          "content": "{\n    \"keyword\" : \"\" ,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "请求成功状态200": [
          {
            "group": "请求成功状态200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>是否请求成功</p>"
          },
          {
            "group": "请求成功状态200",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>提示信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "响应示例:",
          "content": "{\n\n    \"success\" : true,\n    \"message\" : \"请求成功\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "js/5.js",
    "groupTitle": "ads",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/ads/get"
      }
    ]
  },
  {
    "type": "get",
    "url": "/category/get",
    "title": "门票分类管理",
    "name": "get",
    "group": "category",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "keyword",
            "description": "<p>所要搜索的内容</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n    \"keyword\" : \"\" ,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "请求成功状态200": [
          {
            "group": "请求成功状态200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>是否请求成功</p>"
          },
          {
            "group": "请求成功状态200",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>提示信息</p>"
          }
        ],
        "请求成功设置Cookie": [
          {
            "group": "请求成功设置Cookie",
            "type": "set-cookie",
            "optional": false,
            "field": "node_auth",
            "description": "<p>设置cookie，值是签名过的用户名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "响应示例:",
          "content": "{\n    \"success\" : true,\n    \"message\" : \"登录成功\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "js/2.js",
    "groupTitle": "category",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/category/get"
      }
    ]
  },
  {
    "type": "get",
    "url": "/customer/get",
    "title": "客户信息",
    "name": "get",
    "group": "customer",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "keyword",
            "description": "<p>所要搜索的内容</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "size",
            "description": "<p>数据数量</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "page",
            "description": "<p>分页条数</p>"
          }
        ]
      },
      "examples": [
        {
          "title": ":",
          "content": "{\n    \"keyword\" : \"\" ,\n    \"size\":\"\",\n    \"page\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "请求成功状态200": [
          {
            "group": "请求成功状态200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>是否请求成功</p>"
          },
          {
            "group": "请求成功状态200",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>提示信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "响应示例:",
          "content": "{\n\n    \"success\" : true,\n    \"message\" : \"请求成功\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "js/3.js",
    "groupTitle": "customer",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/customer/get"
      }
    ]
  },
  {
    "type": "post",
    "url": "/login",
    "title": "用户登录",
    "name": "login",
    "group": "login",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "loginname",
            "description": "<p>登录名</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n    \"loginname\" : \"admin\" ,\n    \"password\"  : \"123456\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "请求成功状态200": [
          {
            "group": "请求成功状态200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>是否登录成功</p>"
          },
          {
            "group": "请求成功状态200",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>提示信息</p>"
          }
        ],
        "登录成功设置Cookie": [
          {
            "group": "登录成功设置Cookie",
            "type": "set-cookie",
            "optional": false,
            "field": "node_auth",
            "description": "<p>设置cookie，值是签名过的用户名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "响应示例:",
          "content": "{\n    \"success\" : true,\n    \"message\" : \"登录成功\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "js/1.js",
    "groupTitle": "login",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/login"
      }
    ]
  },
  {
    "type": "get",
    "url": "/ticket/get",
    "title": "门票管理",
    "name": "get",
    "group": "ticket",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "keyword",
            "description": "<p>所要搜索的内容</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "size",
            "description": "<p>数据数量</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "page",
            "description": "<p>分页条数</p>"
          }
        ]
      },
      "examples": [
        {
          "title": ":",
          "content": "{\n    \"keyword\" : \"\" ,\n    \"size\":\"\",\n    \"page\":\"\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "请求成功状态200": [
          {
            "group": "请求成功状态200",
            "type": "boolean",
            "optional": false,
            "field": "success",
            "description": "<p>是否请求成功</p>"
          },
          {
            "group": "请求成功状态200",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>提示信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "响应示例:",
          "content": "{\n\n    \"success\" : true,\n    \"message\" : \"请求成功\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "js/4.js",
    "groupTitle": "ticket",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/ticket/get"
      }
    ]
  }
] });
