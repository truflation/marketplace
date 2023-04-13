FROM python:3.10
WORKDIR /usr/src/app
COPY setup.cfg pyproject.toml install.sh start.sh ./
#COPY tests ./tests
COPY feed_updater ./feed_updater
RUN ["/bin/bash", "install.sh"]
EXPOSE 8000
CMD ["/bin/bash", "start.sh"]
