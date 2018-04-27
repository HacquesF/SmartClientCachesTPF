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
data[:Part] = file[:,1]
data[:Client] = file[:,2]
data[:Max] = file[:,3]

#Creating the Hit plot
pMax = plot(data, x="Client", y="Max", color="Part", Geom.line)
imgHit = SVG("tmp/max.svg")
draw(imgHit,pMax)
