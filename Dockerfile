FROM nginx:1.23.1

RUN rm -rf /usr/share/nginx/html/* && apt update -y && apt install git -y && git clone -b gh-pages --single-branch https://github.com/cakenggt/Library-Of-Pybel.git /usr/share/nginx/html/

COPY babel.js libraryofbabel.js index.html /usr/share/nginx/html/

ENTRYPOINT ["nginx", "-g", "daemon off;"]
