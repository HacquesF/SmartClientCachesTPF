# SmartClientCachesTPF

# Setup

Execute dockServer, dockSquid first to launch the server and Squid.
Double check configDock.json for the datasets sources

# Execution

Access the server a first time to create the log file (example: http://localhost:3000 in browser).
Start dockLogServer and dockLogSquid to get the log of Squid and the server.
Then launch dockClient to send request with a ldf-client inside a Docker.

# End

Kill both log feeds.
Stop the dockers:
> Docker stop ldf-client squid

# Troubleshooting

If Squid won't launch, a local Squid may already be listenning to port 3128, so stop it or change the port of one of them.

# Sources
Squid:
> https://github.com/sameersbn/docker-squid

Ldf-client/server
> https://github.com/LinkedDataFragments

# Problem

Make ldf-client use a proxy.

-https://github.com/LinkedDataFragments/Client.js/issues/16 Then ENV http_proxy won't work.

	Iptables
> sudo iptables -t nat -A PREROUTING -p tcp --dport 3000 -j REDIRECT --to 3129 -w

Works with that on the host.

	Cache

Everything goes in memory, can't find how to make it work on disk. That won't be a problem since we can tweak it with cache_mem.

	Client access

Can't use localhost to access the server, need to use the local ip.
