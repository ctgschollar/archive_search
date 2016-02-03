FROM sdp-ingest5.kat.ac.za:5000/docker-base

MAINTAINER Thomas Bennett "tbennett@ska.ac.za"

ENV VER=0.0.1

# Install dependencies.
USER root
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install \
    default-jre \
    tomcat7

USER kat

# Install the current package
COPY target/Archive_Browser-${VER}-SNAPSHOT.war /tmp/install/Archive_Browser
WORKDIR /tmp/install/Archive_Browser/

