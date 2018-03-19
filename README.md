# SmartClientCachesTPF

# Setup

Build the dockers for ldf-allClient, ldf-server and squid. Dockers need to be named like that for the main script to work. Build them with `docker build -t Name .`

# Execution

> start NumberOfClients NumberOfQueries

NumberOfClients : Number of clients to simultaneously run each time.
NumberOfQueries : Size of the workload for each querie.

# Results

The script should return a bar plot, the log file used to make it, and a directory with the most seen and hit http pages of each run.

# Non arguments options

The configurations used for squid are the ones in the *conf* directory. The *AllConf* directory act as a store with the configurations files to chose from. The script require at least one configuration file in directory *conf*.

The dataset file is placed in the repository parent directory, inside zip/datasets. To use a dataset from another place, the executables `dockServer` needs to be modified. Also either change that same file or the `configDock.json` file to change the configuration server file. If the datasource name is changed, `dockClient` also needs to change to execute the clients on it.

# Sources
Squid:
> https://github.com/sameersbn/docker-squid

Ldf-client/server
> https://github.com/LinkedDataFragments

# Problem

## Iptables
> sudo iptables -t nat -A PREROUTING -p tcp --dport 3000 -j REDIRECT --to 3129 -w

That rule is required on the host. The files `setIptables` and `remIptables` are here to help

## Docker
>Error response from daemon: driver "aufs" failed to remove root filesystem for *ContainerID*: could not remove diff path for id *ContainerID*: error preparing atomic delete: rename /var/lib/docker/aufs/
>diff/*ContainerID* /var/lib/docker/aufs/
>diff/*ContainerID*-removing: device or resource busy

Sometimes Docker crashes when trying to remove containers. It seems to happen whenever a container gets started with sudo logged in and the session expires before it gets removed. Since adding Iptables rule is needed, executing the script in another terminal usually works better.
I don't have confirmations nor proofs of the origin of that problem.
