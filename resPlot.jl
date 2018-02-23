#Pkg.add("Plots")
#Pkg.add("GR")
#using Plots
#gr()
#nbTest = 3
#nbHit = [25 50 15]
#nbMiss = [40 20 65]
#nbTot = nbHit + nbMiss
#y = [fill(2*n, nbTot[n]) for n in 1:nbTest]
#q=histogram(y,nbins=5)
#x = [fill(2*n, nbHit[n]) for n in 1:nbTest]
#histogram!(q,x,nbins=5)
#savefig(q,"myplot.pdf")
#     Parsing result from file
#using Gadfly
file = ARGS[1]
m = readdlm(file)
#Average for same policy/size runs
nbCol = size(m,1)
#println(m[1,3])
avg = reshape([],0,2)
avg = m[1, :]
cur = 1
stop = false
curite = 1
while !stop
   count = 1
   ite = curite +1
   stop = false
   while !stop
      if ite > nbCol
         stop = true
      elseif (avg[1,cur] == m[ite,1] && avg[2,cur] == m[ite,2])
         avg[3,cur] = (avg[3,cur]*count + m[ite,3])/(count +1)
         count += 1
         ite +=1
      else
         stop = true
      end
   end
   cur += 1
   curite += ite
   println(cur,nbCol)
   if cur < nbCol
      cat(1,avg,m[curite, :])
      stop = false
   elseif cur == nbCol
      cat(1,avg,m[curite, :])
      stop = true
   else
      stop = true
   end
end
println(avg)
#p = plot(x=pos, y=m[3:3], Geom.bar)
#img = SVG("iris_plot.svg", 6inch, 4inch)
#draw(img, p)
