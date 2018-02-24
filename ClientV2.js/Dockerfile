FROM node:latest

# Install location
ENV dir /opt/ldf-allClient

# Copy the client files
ADD . ${dir}

# Install the node module
RUN cd ${dir} && npm install

# Run base binary
WORKDIR ${dir}
ENTRYPOINT ["node", "ldf-allClient"]

