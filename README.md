# 🐽 HTTP(S) 协议

HTTP（Hypertext Transfer Protocol）和HTTPS（Hypertext Transfer Protocol Secure）是用于在网络上传输数据的协议。这两者都是应用层协议，用于客户端和服务器之间的通信。以下是它们的主要区别：

#### HTTP (Hypertext Transfer Protocol):

1. **不安全性：** HTTP 是不安全的协议，传输的数据是明文的，容易被拦截和窃取。因此，不建议在敏感场景中使用纯HTTP。
2. **端口：** 默认使用端口80。
3. **速度：** 由于不涉及加密，HTTP 的传输速度可能会稍微快一些。
4. **URL：** HTTP 的 URL 以 "http://" 开头。

#### HTTPS (Hypertext Transfer Protocol Secure):

1. **安全性：** HTTPS 使用了 SSL/TLS 协议进行加密，因此传输的数据是加密的，更加安全。这对于涉及用户敏感信息的网站（例如登录信息、支付信息等）至关重要。
2. **端口：** 默认使用端口443。
3. **速度：** 由于涉及加密和解密过程，HTTPS 的传输速度可能会略微减慢。
4. **URL：** HTTPS 的 URL 以 "https://" 开头。

#### 共同点：

1. **协议：** 两者都是基于请求-响应模型的协议，用于在客户端和服务器之间传输超文本。
2. **使用场景：** 通常用于浏览器与服务器之间的通信，用于获取和传输网页上的信息。
