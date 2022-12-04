# 设置基础镜像
FROM nginx:1.17.8
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY .  /usr/share/nginx/html/

#挂载nginx.conf文件，在宿主机文件中配置好nginx.conf后进行映射
COPY nginx.conf /etc/nginx/nginx.conf

#挂载证书文件至nginx 'cert'文件夹
COPY cert/ /etc/nginx/cert/ 