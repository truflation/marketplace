FROM python:3.12
WORKDIR /usr/src/app
COPY  pyproject.toml install.sh start.sh ./
COPY tests ./tests
COPY tfi_orders ./tfi_orders
RUN ["/bin/bash", "install.sh"]
EXPOSE 8000
CMD ["/bin/bash", "start.sh"]