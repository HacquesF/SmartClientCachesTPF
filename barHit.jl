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

Max = mean(file[:,4])
#Creating the Hit plot
phit = plot(data,x="Size",y="Hit",color="Policy",yintercept=[Max],Geom.bar(position=:dodge),Geom.hline(style=:dot),style(default_color=Colors.RGBA(0.5, 0, 0, 1),bar_spacing=0.15cm))
imgHit = SVG("tmp/hit.svg")
draw(imgHit,phit)
