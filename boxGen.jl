Pkg.add("Gadfly")
Pkg.add("DataFrames")

#Loading librairies
using Gadfly, DataFrames

#Openning log file


#Initialisation of variables
data = DataFrame()
data[:CacheSize]=String[]
data[:PercGen]=Float64[]
#For each file
for i= 1 : length(ARGS)
   file = readdlm(ARGS[i])
   for j= 2 : length(file[1,:])
      val = mean(file[:,j])
      append!(data[:CacheSize],[repr(file[1:1])])
      append!(data[:PercGen],[val])
   end
end

pBox=plot(data, x="CacheSize", y="PercGen", Geom.boxplot)
imgBox = SVG("tmp/boxPerc.svg")
draw(imgBox,pBox)
