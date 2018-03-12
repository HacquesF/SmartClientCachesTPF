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

#Creating the plot
p = plot(data,x="Size",y="Hit",color="Policy",Geom.bar(position=:dodge))
img = SVG("tmp/plot.svg")
draw(img,p)
