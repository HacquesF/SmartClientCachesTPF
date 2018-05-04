Pkg.add("Gadfly")
Pkg.add("DataFrames")
#Files: Policy NumberOfClient Max
#Loading librairies
using Gadfly, DataFrames

#Openning log file
file = readdlm(ARGS[1])

#Initialisation of variables
data = DataFrame()

#Filling the DataFrame
data[:POLICY] = file[:,1]
data[:Client] = file[:,2]
data[:TRAFFHIT] = file[:,3]
data[:TRAFFSERV] = file[:,4]
#Creating the Hit plot
pHIT = plot(data, layer(x="Client", y="TRAFFHIT", color="POLICY", Geom.line, style(line_style=:dash)),
                  layer(x="Client", y="TRAFFSERV", color="POLICY", Geom.line, style(line_style=:solid)), Guide.ylabel("Traffic"))
imgHit = SVG("tmp/traff.svg")
draw(imgHit,pHIT)
