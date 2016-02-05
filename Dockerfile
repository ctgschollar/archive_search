FROM sdp-ingest5.kat.ac.za:5000/docker-base

MAINTAINER Thomas Bennett "tbennett@ska.ac.za"

ENV VER=7.0.67

# Install dependencies.
USER root
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install \
    default-jre \
    unzip \
    wget

# Install the current package.
RUN wget --directory-prefix /tmp/install/ http://apache.is.co.za/tomcat/tomcat-7/v${VER}/bin/apache-tomcat-${VER}.tar.gz \
    && cd /tmp/install \
    && tar zxf /tmp/install/apache-tomcat-${VER}.tar.gz -C /opt/ \
    && rm -rf /tmp/install \
    && chown -R kat. /opt/apache-tomcat-${VER}/

USER kat
COPY target/archive_search-0.1.war /opt/apache-tomcat-${VER}/webapps/archive_search.war
WORKDIR /opt/apache-tomcat-${VER}/bin
