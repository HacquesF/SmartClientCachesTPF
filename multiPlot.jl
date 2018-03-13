Pkg.add("Gadfly")
Pkg.add("DataFrames")

#Loading librairies
using Gadfly, DataFrames

#Openning log file
file = readdlm(ARGS[1])

#Initialisation of variables
data = DataFrame()
#Making sizes into percentages
file[:,2] = file[:,2]/3750

#Filling the DataFrame
data[:Policy] = file[:,1]
#data[:Size] = [repr(x) for x in file[:,2]]
data[:Size] = file[:,2]
data[:Hit] = file[:,3]
sort!(data,cols=[:Size])
data[:Size] = [repr(x) for x in data[:Size]]
data[:Max] = file[:,4]
data[:Scale] = file[:,5]

#Creating the Hit plot
phit = plot(data,layer(x="Size",y="Max", color="Policy", Geom.line),
                 layer(x="Size",y="Hit",color="Policy",Geom.bar(position=:dodge)))
imgHit = SVG("tmp/hit.svg")
draw(imgHit,phit)

pScale = plot(data,x="Size",y="Scale",color="Policy",Geom.bar(position=:dodge))
imgScale = SVG("tmp/scale.svg")
draw(imgScale,pScale)
